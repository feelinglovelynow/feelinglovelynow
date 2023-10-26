import type { Order } from '$lib'
import graphql from '$lib/dgraph/graphql'


export default async function queryOrder (): Promise<Order[]> {
  const response = await graphql({
    query: `
      query MyQuery {
        queryOrder {
          id
          createdAt
          name
          email
          addressLine1
          addressLine2
          zip
          state
          country 
          totalPrice
          orderItems {
            id
            size
            quantity
            product {
              id
              slug
            }
          }
        }
      }
    `
  })

  return response?.data?.queryOrder || []
}
