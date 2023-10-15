<script lang="ts">
  import type { Price } from '$lib'
  import '$lib/scss/braintree.scss'
  import { theme } from '$lib/util/store'
  import { cart, set } from '$lib/store/cart'
  import showToast from '@sensethenlove/toast'
  import { PUBLIC_BRAINTREE_TOKENIZATION_KEY } from '$env/static/public'
  import { client, hostedFields, type BraintreeError, type HostedFields, type HostedFieldsTokenizePayload } from 'braintree-web'
  import Button from './Button.svelte';

  export let name: string
  export let email: string
  export let address: string
  export let zip: string
  export let country: string
  export let totalPrice: Price

  let save = () => {}
  let isLoading: boolean = true
  let highHostedFieldsInstance: HostedFields | undefined

  theme.subscribe(onThemeUpdate)
  client.create({ authorization: PUBLIC_BRAINTREE_TOKENIZATION_KEY }, onClientCreated)


  function onThemeUpdate (theme: string) {
    if (theme && highHostedFieldsInstance) {
      for (const field of [ 'number', 'cvv', 'expirationDate', 'postalCode' ]) {
        highHostedFieldsInstance.addClass(field, theme === 'light' ? 'braintree__light-input' : 'braintree__dark-input')
        highHostedFieldsInstance.removeClass(field, theme === 'light' ? 'braintree__dark-input' : 'braintree__light-input')
      }
    }
  }


  function onClientCreated (error: BraintreeError | undefined, clientInstance: any) {
    if (error) {
      console.error(error)
      showToast({ type: 'info', items: [ 'There was an error processing your payment' ] })
    } else if (clientInstance) {
      const style = getComputedStyle(document.body)

      hostedFields.create({
        client: clientInstance,
        styles: {
          'input': {
            'height': '39px',
            'padding': '8px',
            'font-size': '15px',
            'color': style.getPropertyValue('--text-color'),
            'font-family': 'Inter, ui-sans-serif, system-ui',
          },
          '.braintree__dark-input': {
            'color': '#eceaea',
            'border-color': 'rgb(75, 85, 99)',
            'background-color': 'rgb(55, 65, 81, 0.6)',
          },
          '.braintree__light-input': {
            'color': '#273142',
            'border-color': '#ced3d6',
            'background-color': 'rgb(255, 255, 255, 0.6)',
          },
          ':-webkit-autofill': {
            color: '#000',
          },
        },
        fields: {
          number: {
            container: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            container: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            container: '#expiration-date',
            placeholder: '09/2034'
          },
          postalCode: {
            container: '#postal-code'
          }
        }
      }, onHostedFieldsCreated)
    }
  }


  function onHostedFieldsCreated (error: BraintreeError | undefined, hostedFieldsInstance: HostedFields | undefined) {
    if (error) {
      console.error(error)
      showToast({ type: 'info', items: [ 'There was an error processing your payment' ] })
    } else if (hostedFieldsInstance) {
      isLoading = false
      highHostedFieldsInstance = hostedFieldsInstance

      save = () => {
        hostedFieldsInstance.tokenize(onHostedFieldsTokenized)
      }
    }
  }


  async function onHostedFieldsTokenized (error: BraintreeError | undefined, payload: HostedFieldsTokenizePayload | undefined) {
    const errors = validateForm(error)

    if (errors.length) {
      console.error(error)
      showToast({ type: 'info', items: errors })
    } else if (payload) {
      isLoading = true

      const fetchResponse = await fetch('/cart', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nonce: payload.nonce, name, email, address, zip, country, totalPrice, cart: $cart }),
      })

      const response = await fetchResponse.json()

      if (response._errors?.length) showToast({ type: 'info', items: response._errors })
      else {
        set([])
        showToast({ type: 'success', items: [ 'Success! Thank you! Please check your email for order confirmation details!' ] })
      }

      isLoading = false
    }
  }


  function validateForm (error: BraintreeError | undefined) {
    const errors = []

    if (!name) errors.push('Please add Name')
    if (!email) errors.push('Please add Email')
    if (!address) errors.push('Please add Shipping: Address')
    if (!zip) errors.push('Please add Shipping: Zip')
    if (!country) errors.push('Please add Shipping: Country')

    switch (error?.code) {
      case 'HOSTED_FIELDS_FIELDS_INVALID':
        if (error.details.invalidFieldKeys.includes('number')) errors.push('Please add a valid Billing: Card Number')
        if (error.details.invalidFieldKeys.includes('expirationDate')) errors.push('Please add a valid Billing: Expiration Date')
        if (error.details.invalidFieldKeys.includes('postalCode')) errors.push('Please add a valid Billing: Zip')
        if (error.details.invalidFieldKeys.includes('cvv')) errors.push('Please add a valid Billing: CVV')
        break
      case 'HOSTED_FIELDS_FIELDS_EMPTY':
        errors.push('Please add Billing: Card Number')
        errors.push('Please add Billing: Expiration Date')
        errors.push('Please add Billing: Zip')
        errors.push('Please add Billing: CVV')
        break
    }

    return errors
  }
</script>


<div class="braintree">
  <div class="braintree__form-item">
    <label for="card-number" class="braintree__label">Card Number</label>
    <div id="card-number" class="braintree__input"></div>
  </div>

  <div class="braintree__form-item">
    <label for="expiration-date" class="braintree__label">Expiration Date</label>
    <div id="expiration-date" class="braintree__input"></div>
  </div>

  <div class="braintree__form-items">
    <div class="braintree__form-item">
      <label for="postal-code" class="braintree__label">Zip</label>
      <div id="postal-code" class="braintree__input"></div>
    </div>

    <div class="braintree__form-item">
      <label for="cvv" class="braintree__label">CVV</label>
      <div id="cvv" class="braintree__input"></div>
    </div>
  </div>

  <Button text="Purchase" css="full-width" { isLoading } onClick={ save } />
</div>
