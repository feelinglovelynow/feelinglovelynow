import dgraph from '$lib/dgraph/dgraph'
import type { Order, SearchOrdersRequest } from '$lib'


export default async function queryOrder (search: SearchOrdersRequest = {}): Promise<Order> {
  let params = 'order: {desc: createdAt}'

  if (search.orderId) params += `, filter: {id: {eq: "${ search.orderId }"}}`
  else if (search.email) params += `, filter: {email: {eq: "${ search.email }"}}`
  else if (search.startDate && search.endDate) params += `filter: {createdAt: {between: {min: "${ (new Date(search.startDate)).toISOString() }", max: "${ (new Date(search.endDate)).toISOString() }"}}}`

  const { queryOrder } = await dgraph({
    query: `
      query MyQuery {
        queryOrder(${ params }) {
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

  return queryOrder as Order
}
