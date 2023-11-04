import dgraph from '$lib/dgraph/dgraph'
import type { AddOrderRequestOrderItems, PrettyPaypal } from '$lib'


export default async function addOrder (id: string, orderItems: AddOrderRequestOrderItems, pretty: PrettyPaypal) {
  return dgraph({
    query: `
      mutation MyMutation($input: [AddOrderInput!]! = {id: ""}) {
        addOrder(input: $input) {
          order {
            id
            createdAt
            orderItems {
              id
            }
          }
        }
      }
    `,
    variables: {
      input: {
        id,
        orderItems,
        status: pretty.status,
        email: pretty.email,
        name: pretty.name,
        addressLine1: pretty.addressLine1,
        addressLine2: pretty.addressLine2,
        city: pretty.city,
        state: pretty.state,
        zip: pretty.zip,
        country: pretty.country,
        paypalFee: pretty.paypalFee.num,
        totalPrice: pretty.totalPrice.num,
        createdAt: (new Date()).toISOString(),
      }
    }
  })
}
