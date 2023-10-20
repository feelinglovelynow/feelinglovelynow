import get from '$lib/kv/get'
import Price from '$lib/store/Price'
import type { Cart, Product } from '$lib'
import expandSubTotal from '$lib/store/expandSubTotal'


export async function validateRequestCart (cart: Cart, requestTotalPrice: Price, platform: Readonly<App.Platform> | undefined) {
  const _errors = validateFields([], cart, requestTotalPrice)
  const requestSubTotal = await mergeCartWithProducts(_errors, cart, platform)
  const expandedSubTotal = _expandSubTotal(_errors, requestSubTotal, requestTotalPrice)

  return { _errors, expandedSubTotal }
}


function validateFields (_errors: string[], cart: Cart, requestTotalPrice: Price) {
  if (!requestTotalPrice.num || !requestTotalPrice.str) _errors.push('Please add a totalPrice to the request')
  if (!cart.length) _errors.push('Please add items in cart in request')

  return _errors
}


async function mergeCartWithProducts (_errors: string[], cart: Cart, platform: Readonly<App.Platform> | undefined) {
  const cartSubTotal = new Price()

  if (!_errors.length) {
    const kvProducts = await get('MAIN_CACHE', 'products', platform) as Product[]

    for (const cartItem of cart) { // give each product in the cart a product object (so we know it's price)
      for (const product of kvProducts) {
        if (!cartItem.productId) break
        else if (cartItem.productId === product.id) {
          cartItem.product = product
          break
        }
      }
    }

    for (const cartItem of cart) {
      if (!cartItem.productId) _errors.push('All items in cart need a productId')
      else if (!cartItem.product) _errors.push(`Product id: "${ cartItem.productId }", that is in your cart, is not a valid product id`)
      else if (!cartItem.quantity || !Number.isInteger(cartItem.quantity)) {
        if (cartItem?.product?.name) _errors.push(`Product name: "${ cartItem.product.name }" needs a quantity to proceed`)
        else if (cartItem.productId) _errors.push(`Product id: "${ cartItem.productId }" needs a quantity to proceed`)
        else _errors.push('All items in cart need a quantity')
      } else {
        cartItem.subTotal = new Price(cartItem.product.price * cartItem.quantity) // sets the num and the str
        cartSubTotal.add(cartItem.subTotal.num) // add cart items subTotal to the cart's subTotal AND updates the str
      }
    }
  }

  return cartSubTotal
}


function _expandSubTotal (_errors: string[], requestSubTotal: Price, requestTotalPrice: Price) {
  if (_errors.length) return null
  else {
    const expandedSubTotal = expandSubTotal(requestSubTotal.num)

    if (expandedSubTotal.totalPrice.str !== requestTotalPrice.str) _errors.push('Total price in request is wrong')

    return expandedSubTotal
  }
}