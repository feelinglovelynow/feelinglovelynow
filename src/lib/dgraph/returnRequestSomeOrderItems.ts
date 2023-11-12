import dgraph from '$lib/dgraph/dgraph'
import type { Order, OrderItem, ReturnRequestSome } from '$lib'


export default async function returnRequestSomeOrderItems ({ dgraphOrder, justReturnRequestedSome }: { dgraphOrder: Order, justReturnRequestedSome: ReturnRequestSome}) {
  const values = await Promise.all(justReturnRequestedSome.map(r => {
    return Promise.all([
      /**
       * @ dgraphOrderItem.id set:
       *  quantity: dgraphOrderItem.quantity - bodyOrderItem.quantity
       */
      dgraph({
        query: `
          mutation MyMutation {
            updateOrderItem(input: {filter: {id: {eq: "${ r.dgraphOrderItem.id }"}}, set: {quantity: ${ r.dgraphOrderItem.quantity  - r.bodyOrderItem.quantity }}}) {
              numUids
            }
          }
        `
      }),

      /**
       * Add new orderItem:
       *  id: crypto.randomUUID()
       *  orderId: dgraphOrder.id
       *  productId: dgraphOrderItem.product?.id
       *  status: RETURN_REQUESTED
       *  quantity: bodyOrderItem.quantity
       *  refundAmount: bodyOrderItem.refundAmount
       *  size: dgraphOrderItem.size || ''
       */
      dgraph({
        query: `
          mutation MyMutation {
            addOrderItem(input: {id: "${ crypto.randomUUID() }", order: {id: "${ dgraphOrder.id }"}, product: {id: "${ r.dgraphOrderItem.product?.id }"}, status: RETURN_REQUESTED, quantity: ${ r.bodyOrderItem.quantity }, refundAmount: ${ r.bodyOrderItem.refundAmount }, size: "${ r.dgraphOrderItem.size || '' }"}) {
              orderItem {
                id
                size
                quantity
                product {
                  id
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
    ])
  }))

  const orderItems: OrderItem[] = []

  for (const v of values) {
    orderItems.push(v[1].addOrderItem.orderItem[0])
  }

  return orderItems
}
