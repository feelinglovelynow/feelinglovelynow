import Price from '$lib/store/Price'
import type { Cart, Product } from '$lib'
import expandSubTotal from '$lib/store/expandSubTotal'


export default function loopCart ($cart: Cart, allProducts: Product[] | undefined) {
  const cartItems: Cart = [] // reset cart items
  const cartSubTotal = new Price() // reset cart sub total

  for (const cartItem of $cart) {
    const product = allProducts?.find(p => p.id === cartItem.productId) // find the product in all products for this cart item by product id

    if (product) {
      cartSubTotal.add(product.price * cartItem.quantity) // add to the cart sub total the price of this product * the number of products at this price

      cartItems.push({ // add the product to the cartItems array
        product,
        id: cartItem.id,
        size: cartItem.size,
        quantity: cartItem.quantity,
      })
    }
  }

  return { // return the cartItems and the additional information we get from subTotal like salexTax and totalPrice
    cartItems,
    ...expandSubTotal(cartSubTotal.num),
  }
}
