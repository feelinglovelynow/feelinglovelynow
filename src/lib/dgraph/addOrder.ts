import graphql from '$lib/dgraph/graphql'
import type { AddOrderCart, PrettyPaypal } from '$lib'


export default async function addOrder (id: string, cart: AddOrderCart, pretty: PrettyPaypal) {
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
        cart,
        status: pretty.status,
        email: pretty.email,
        name: pretty.name,
        address: `${ pretty.addressLine1 }${ pretty.addressLine2 ? ' ' + pretty.addressLine2 : ''} ${ pretty.city }, ${ pretty.state }, ${ pretty.zip }`,
        country: pretty.country,
        paypalFee: pretty.paypalFee.num,
        totalPrice: pretty.totalPrice.num,
        createdAt: (new Date()).toISOString(),
      }
    }
  })
}
