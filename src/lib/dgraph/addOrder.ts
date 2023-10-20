import graphql from '$lib/dgraph/graphql'
import type { AddOrderCart } from '$lib'


export default async function addOrder (id: string, email: string, name: string, addressLine1: string, addressLine2: string, city: string, state: string, zip: string, country: string, totalPrice: number, cart: AddOrderCart[], status: string, paypalFee: number) {
  return graphql({
    query: `
      mutation MyMutation($input: [AddOrderInput!]! = {id: ""}) {
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
        id,
        email,
        name,
        address: `${ addressLine1 }${ addressLine2 ? ' ' + addressLine2 : ''} ${ city }, ${ state }, ${ zip }`,
        country,
        totalPrice,
        cart,
        createdAt: (new Date()).toISOString(),
        status,
        paypalFee
      }
    }
  })
}
