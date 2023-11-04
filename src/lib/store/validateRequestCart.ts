import get from '$lib/kv/get'
import Price from '$lib/store/Price'
import { one } from '$lib/catch/error'
import type { Cart, Product } from '$lib'
import expandSubTotal from '$lib/store/expandSubTotal'


export async function validateRequestCart (cart: Cart, requestTotalPrice: Price, platform: Readonly<App.Platform> | undefined) {
  validateFields(cart, requestTotalPrice)
  const requestSubTotal = await mergeCartWithProducts(cart, platform)
  return _expandSubTotal(requestSubTotal, requestTotalPrice)
}


function validateFields (cart: Cart, requestTotalPrice: Price) {
  if (!requestTotalPrice.num || !requestTotalPrice.str) throw one('Please add a totalPrice to the request', { requestTotalPrice })
  if (!cart.length) throw one('Please add items in cart in request', { cart })
}


async function mergeCartWithProducts (cart: Cart, platform: Readonly<App.Platform> | undefined) {
  const cartSubTotal = new Price()

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
    if (!cartItem.productId) throw one('All items in cart need a productId', { cartItem })
    else if (!cartItem.product) throw one(`Product id: "${ cartItem.productId }", that is in your cart, is not a valid product id`, { cartItem })
    else if (!cartItem.quantity || !Number.isInteger(cartItem.quantity)) {
      if (cartItem?.product?.name) throw one(`Product name: "${ cartItem.product.name }" needs a quantity to proceed`, { cartItem })
      else if (cartItem.productId) throw one(`Product id: "${ cartItem.productId }" needs a quantity to proceed`, { cartItem })
      else throw one('All items in cart need a quantity', { cartItem })
    } else {
      cartItem.subTotal = new Price(cartItem.product.price * cartItem.quantity) // sets the num and the str
      cartSubTotal.add(cartItem.subTotal.num) // add cart items subTotal to the cart's subTotal AND updates the str
    }
  }

  return cartSubTotal
}


function _expandSubTotal (requestSubTotal: Price, requestTotalPrice: Price) {
  const expandedSubTotal = expandSubTotal(requestSubTotal.num)

  if (expandedSubTotal.totalPrice.str !== requestTotalPrice.str) throw one('Total price in request is wrong', { requestSubTotal: JSON.stringify(requestSubTotal), expandedSubTotal: JSON.stringify(expandedSubTotal) })

  return expandedSubTotal
}
