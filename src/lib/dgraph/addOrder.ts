import Price from '$lib/store/Price'
import graphql from '$lib/dgraph/graphql'
import type { CartRequest, Transaction } from '$lib'


export default async function addOrder (body: CartRequest, transaction: Transaction, totalPrice: Price) {
  return graphql({
    query: `
      mutation MyMutation($input: [AddOrderInput!] = {}) {
        addOrder(input: $input) {
          order {
            id
            createdAt
            cart {
              id
            }
          }
        }
      }
    `,
    variables: {
      input: {
        transaction,
        nonce: body.nonce,
        name: body.name,
        email: body.email,
        address: body.address,
        zip: body.zip,
        country: body.country,
        price: totalPrice.num,
        createdAt: (new Date()).toISOString(),
        cart: body.cart.map(cartItem => ({
          id: cartItem.id,
          size: cartItem.size,
          quantity: cartItem.quantity,
          Product: cartItem.product,
        }))
      }
    }
  })
}
