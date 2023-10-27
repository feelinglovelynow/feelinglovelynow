import type { Order } from '$lib'
import graphql from '$lib/dgraph/graphql'


export default async function queryOrder (): Promise<Order[]> {
  const response = await graphql({
    query: `
      query MyQuery {
        queryOrder(order: {desc: createdAt}) {
          id
          createdAt
          name
          email
          addressLine1
          addressLine2
          zip
          state
          city
          country 
          totalPrice
          orderItems {
            id
            size
            quantity
            product {
              id
              slug
              name
              primaryImage {
                id
                extension
              }
            }
          }
        }
      }
    `
  })

  return response?.data?.queryOrder || []
}
