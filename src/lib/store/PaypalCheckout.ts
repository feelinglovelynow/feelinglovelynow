import type { Cart } from '$lib'
import Price from '$lib/store/Price'
import { set } from '$lib/store/cart'
import showToast from '@sensethenlove/toast'
import SVG_LOADING from '$lib/svg/SVG_LOADING.svg'
import type { HideModal } from '@sensethenlove/svelte-modal'
import { PUBLIC_PAYPAL_SANDBOX_CLIENT_ID } from '$env/static/public'
import { loadScript, type PayPalNamespace, type OnApproveData } from '@paypal/paypal-js'


export default class Braintree {
  cart?: Cart
  totalPrice?: Price
  hideModal?: HideModal
  wrapper?: HTMLDivElement
  #loadingClass = 'paypal-checkout__loading'


  create (wrapper: HTMLDivElement, cart: Cart, totalPrice: Price, hideModal: HideModal) {
    this.cart = cart
    this.wrapper = wrapper
    this.hideModal = hideModal
    this.totalPrice = totalPrice

    if (this.cart && this.wrapper && this.totalPrice) {
      this.#showOnlyLoadingIcon()
      this.#loadScript()
    }
  }


  #showOnlyLoadingIcon () {
    if (this.wrapper) this.wrapper.innerHTML = `<span class="${ this.#loadingClass }">${ SVG_LOADING }</span>`
  }

 
  #loadScript () {
    loadScript({ clientId: PUBLIC_PAYPAL_SANDBOX_CLIENT_ID, currency: 'USD', intent: 'capture', disableFunding: 'paylater' })
      .then(x => {
        if (x) this.#onScriptLoaded(x)
        else this.#onError('Paypal script did not load')
      })
      .catch(this.#onError)
  }


  #onScriptLoaded (paypal: PayPalNamespace) {
    if (paypal && paypal.Buttons && this.wrapper) {
      paypal
        .Buttons({
          style: { disableMaxWidth: true },
          createOrder: () => this.#createOrder(),
          onApprove: (data) => this.#onApprove(data),
        })
        .render(this.wrapper)
        .catch(this.#onError)

      this.#hideLoadingIcon()
    }
  }


  #onError (error: any) {
    console.error(error)
    showToast({ type: 'info', items: [ 'There was an error creating the payment form' ] })
  }


  async #createOrder () { // on paypal checkout click
    const self = this

    const fetchResponse = await fetch('/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: self.cart,
        totalPrice: self.totalPrice,
      })
    })

    const response = await fetchResponse.json()

    if (response.id) return response.id
    else if (response._errors?.length) {
      showToast({ type: 'info', items: response._errors })
      return null
    }
  }


  async #onApprove (data: OnApproveData) {
    const fetchResponse = await fetch('/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: data.orderID,
      })
    })

    const response = await fetchResponse.json()

    if (response._errors?.length) showToast({ type: 'info', items: response._errors })
    else if (response.status !== 'COMPLETED') showToast({ type: 'info', items: [ 'Paypal purchase error occured, please contact us' ] })
    else if (this.hideModal) {
      set([])
      this.hideModal()
      showToast({ type: 'success', items: [ 'Thank you for your successful purchase!' ] })
    }
  }


  #hideLoadingIcon () {
    const loading = this.wrapper?.querySelector(`.${ this.#loadingClass }`) as HTMLSpanElement
    if (loading) loading.style.display = 'none'
  }
}
