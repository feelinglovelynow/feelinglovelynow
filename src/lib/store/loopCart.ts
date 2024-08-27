import Price from '$lib/store/Price'
import type { Cart, Product } from '$lib'
import expandSubTotal from '$lib/store/expandSubTotal'
import { twoDecimalPlaces } from './twoDecimalPlaces'


export default function loopCart ($cart: Cart, mapAllProducts: Map<number, Product>) {
  const cartItems: Cart = []
  const cartSubTotal = new Price()
  const cartHighSubTotal = new Price() // calculate high price to get discount

  for (const cartItem of $cart) {
    const product = mapAllProducts.get(cartItem.productId)

    if (product?.price && product?.highPrice) {
      cartSubTotal.add(product.price * cartItem.quantity) // add to the cart sub total the price of this product * the number of products at this price
      cartHighSubTotal.add(product.highPrice * cartItem.quantity)

      cartItems.push({ // add the product to the cartItems array
        product,
        key: cartItem.key,
        size: cartItem.size,
        quantity: cartItem.quantity,
      })
    }
  }

  const response = {
    cartItems,
    savings: '',
    price: expandSubTotal(cartSubTotal.num),
    highPrice: expandSubTotal(cartHighSubTotal.num),
  }

  response.savings = twoDecimalPlaces(response.highPrice.totalPrice.num - response.price.totalPrice.num)

  return response
}
