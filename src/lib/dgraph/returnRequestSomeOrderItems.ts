import type { Order, ReturnRequestSome } from '$lib'
import type { DgraphTransaction } from '$lib/global/dgraph'


export default async function returnRequestSomeOrderItems ({ transaction, dgraphOrder, justReturnRequestedSome }: { transaction: DgraphTransaction, dgraphOrder: Order, justReturnRequestedSome: ReturnRequestSome[]}): Promise<string[]> {
  let mutation = ''

  for (let i = 0; i < justReturnRequestedSome.length; i++) { // loop order items that are requesting a refund but not all the order items quantity are requsting to be refunded
    const r = justReturnRequestedSome[i]

    /**
     * Update the original order item:
     * Add new orderItem:
     * Link Order.orderItems to new orderItem
     */
    mutation += `
      <${ r.dgraphOrderItem.uid }> <OrderItem.quantity> "${ r.dgraphOrderItem.quantity  - r.bodyOrderItem.quantity }" .

      _:${ i } <dgraph.type> "OrderItem" .
      _:${ i } <OrderItem.product> <${ r.dgraphOrderItem.product.uid }> .
      _:${ i } <OrderItem.status> "RETURN_REQUESTED" .
      _:${ i } <OrderItem.quantity> "${ r.bodyOrderItem.quantity }" .
      _:${ i } <OrderItem.refundAmount> "${ r.bodyOrderItem.refundAmount }" .
      _:${ i } <OrderItem.size> "${ r.dgraphOrderItem.size || '' }" .      

      <${ dgraphOrder.uid }> <Order.orderItems> _:${ i } .
    `
  }

  const r = await transaction.mutate({ mutation })

  return Object.values(r?.data?.uids) // return recently created uids in an array
}
