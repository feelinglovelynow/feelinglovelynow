import type { Order } from '$lib'
import dgraph from '$lib/dgraph/dgraph'


export default async function getOrder (orderId: string): Promise<Order> {
  const { getOrder } = await dgraph({
    query: `
      query MyQuery {
        getOrder(id: "${ orderId }") {
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
