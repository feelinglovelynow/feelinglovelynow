import type { Order } from '$lib'
import dgraph from '$lib/dgraph/dgraph'


export default async function getOrder (orderId: string): Promise<Order> {
  const { getOrder } = await dgraph({
    query: `
      query MyQuery {
        getOrder(id: "${ orderId }") {
          name
          addressLine1
          addressLine2
          city
          state
          country
          zip
          email
          orderItems(order: {}) {
            id
            status
          }
        }
      }
    `
  })

  return getOrder as Order
}
