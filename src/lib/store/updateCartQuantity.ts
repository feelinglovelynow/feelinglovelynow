import type { Cart } from '$lib'
import { set } from '$lib/store/cart'
import showToast from '@feelinglovelynow/toast'
import type { HideModal } from '@feelinglovelynow/svelte-modal'


export default function updateCartQuantity ($cart: Cart, hideModal: HideModal, cartIndex: number, quantity: string) {
  const numQuantity = Number(quantity) // convert the provided quantity from a string to a number

  if (numQuantity) $cart[cartIndex].quantity = numQuantity // if quantity is greater then 0 => set quantity in cart to provided quantity
  else $cart.splice(cartIndex, 1) // else => remove item from cart

  set($cart) // update cart in store / local storage

  if ($cart.length === 0) { // if no items in cart left
    hideModal() // hide the shopping cart modal
    showToast({ type: 'success', items: [ 'Shopping cart cleared!' ] }) // notify clear
  }
}
