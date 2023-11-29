import Price from '$lib/store/Price'
import { set } from '$lib/store/cart'
import { log } from '@feelinglovelynow/svelte-catch'
import showToast from '@feelinglovelynow/toast'
import type { HideModal } from '@feelinglovelynow/svelte-modal'
import publicPaypalCredentials from '$lib/store/publicPaypalCredentials'
import type { CaptureOrderRequest, Cart, CreateOrderRequest } from '$lib'
import { loadScript, type PayPalNamespace, type OnApproveData } from '@paypal/paypal-js'


export default class Braintree {
  cart?: Cart
  totalPrice?: Price
  hideModal?: HideModal
  divWrapper?: HTMLDivElement
  divLoading?: HTMLDivElement


  /* When an order items quantity is updated the cartItems and totalPrice change and this create function
   * is called again to send paypal the new cartItems and totalPrice. this.#clearWrapper() ensures that 
   * if this.create() is called for a 2nd time, the previous checkout is cleared b4 we create another one
   */
  create (divWrapper: HTMLDivElement, divLoading: HTMLDivElement, cart: Cart, totalPrice: Price, hideModal: HideModal) {
    this.cart = cart
    this.divWrapper = divWrapper
    this.divLoading = divLoading
    this.hideModal = hideModal
    this.totalPrice = totalPrice

    if (this.cart && this.divWrapper && this.totalPrice && this.cart.length) { // IF there are no cart items the modal is about to close
      this.#clearWrapper()
      this.#showLoadingIcon('middle')
      this.#loadScript()
    }
  }


  #clearWrapper () {
    if (this.divWrapper) this.divWrapper.innerHTML = ''
  }


  #showLoadingIcon (where: 'middle' | 'bottom') {
    if (this.divLoading) this.divLoading.classList.add('visible-' + where)
  }


  #hideLoadingIcon () {
    if (this.divLoading) this.divLoading.classList.remove('visible-middle', 'visible-bottom')
  }

 
  #loadScript () {
    loadScript({ clientId: publicPaypalCredentials().clientId, currency: 'USD', intent: 'capture' })
      .then(x => {
        if (x) this.#onScriptLoaded(x)
        else this.#onError('PayPal script did not load')
      })
      .catch(this.#onError)
  }


  #onScriptLoaded (paypal: PayPalNamespace) {
    if (paypal && paypal.Buttons && this.divWrapper) {
      paypal
        .Buttons({
          style: { disableMaxWidth: true },
          createOrder: () => this.#createOrder(),
          onApprove: (data) => this.#onApprove(data),
        })
        .render(this.divWrapper)
        .then(() => this.#hideLoadingIcon())
        .catch(this.#onError)

      this.#hideLoadingIcon()
    }
  }


  #onError (error: any) {
    log({ error })
    showToast('info', 'There was an error creating the payment form')
  }


  async #createOrder () { // on paypal checkout click
    const self = this

    const body: CreateOrderRequest = {
      cart: self.cart,
      totalPrice: self.totalPrice,
    }

    this.#showLoadingIcon('bottom')

    const rFetch = await fetch('/paypal/create-order', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })

    const r = await rFetch.json()

    if (r._errors?.length) showToast('info', r._errors)

    this.#hideLoadingIcon()

    return r?.id
  }


  async #onApprove (data: OnApproveData) { // on paypal widget completion success
    const self = this

    const body: CaptureOrderRequest = {
      cart: self.cart,
      paypalId: data.orderID,
      totalPrice: self.totalPrice,
    }

    this.#showLoadingIcon('bottom')

    const rFetch = await fetch('/paypal/capture-order', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })

    const r = await rFetch.json()

    if (r._errors?.length) showToast('info', r._errors)
    else {
      set([])
      if (this.hideModal) this.hideModal()
      showToast('success', 'Thank you for your successful purchase!')
    }

    this.#hideLoadingIcon()
  }
}
