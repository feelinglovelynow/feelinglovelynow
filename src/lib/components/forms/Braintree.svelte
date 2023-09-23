<script lang="ts">
  import { onMount } from 'svelte'
  import '$lib/scss/braintree.scss'
  import Title from '../Title.svelte'
  import { theme } from '$lib/util/store'
  import showToast from '@sensethenlove/toast'
  import { PUBLIC_BRAINTREE_TOKENIZATION_KEY } from '$env/static/public'
  import { client, hostedFields, type BraintreeError, type HostedFields, type HostedFieldsTokenizePayload } from 'braintree-web'

  let form: HTMLFormElement
  let submitButton: HTMLButtonElement
  let highHostedFieldsInstance: HostedFields | undefined

  onMount(bootstrap)
  theme.subscribe(onThemeUpdate)


  function onThemeUpdate (theme: string) {
    if (theme && highHostedFieldsInstance) {
      for (const field of [ 'number', 'cvv', 'expirationDate', 'postalCode' ]) {
        highHostedFieldsInstance.addClass(field, theme === 'light' ? 'braintree__light-input' : 'braintree__dark-input')
        highHostedFieldsInstance.removeClass(field, theme === 'light' ? 'braintree__dark-input' : 'braintree__light-input')
      }
    }
  }


  function bootstrap () {
    client.create({ authorization: PUBLIC_BRAINTREE_TOKENIZATION_KEY }, onClientCreated)
  }


  function onClientCreated (error: BraintreeError | undefined, clientInstance: any) {
    if (error) {
      console.error(error)
      showToast({ type: 'info', items: [ 'There was an error creating our payment submission' ] })
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
      showToast({ type: 'info', items: [ 'There was an error creating our payment submission' ] })
    } else if (hostedFieldsInstance) {
      submitButton.removeAttribute('disabled')
      highHostedFieldsInstance = hostedFieldsInstance
      hostedFieldsInstance.focus('number')

      form.addEventListener('submit', (event: SubmitEvent) => {
        event.preventDefault()
        hostedFieldsInstance.tokenize(onHostedFieldsTokenized)
      }, false)
    }
  }


  function onHostedFieldsTokenized (error: BraintreeError | undefined, payload: HostedFieldsTokenizePayload | undefined) {
    if (error) {
      console.error(error)
      showToast({ type: 'info', items: [ 'There was an error creating our payment submission' ] })
    } else if (payload) {
      fetch('/purchase', {
        method: 'POST',
        body: JSON.stringify({ nonce: payload.nonce }),
        headers: { 'content-type': 'application/json' },
      })
    }
  }
</script>


<Title noBottom={ true } text="Billing Information" />
<section>
  <form action="/" id="my-sample-form" method="post" bind:this={ form }>
    <div class="braintree__form-item">
      <label for="card-number" class="braintree__label">Card Number</label>
      <div id="card-number" class="braintree__input"></div>
    </div>

    <div class="braintree__form-item">
      <label for="cvv" class="braintree__label">CVV</label>
      <div id="cvv" class="braintree__input"></div>
    </div>

    <div class="braintree__form-item">
      <label for="expiration-date" class="braintree__label">Expiration Date</label>
      <div id="expiration-date" class="braintree__input"></div>
    </div>

    <div class="braintree__form-item">
      <label for="postal-code" class="braintree__label">Postal Code</label>
      <div id="postal-code" class="braintree__input"></div>
    </div>

    <button type="submit" class="brand full-width" disabled bind:this={ submitButton }>Purchase</button>
  </form>
</section>


<style lang="scss">
  .brand {
    margin-top: 1.5rem;
  }
</style>
