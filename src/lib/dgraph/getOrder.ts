import type { Order } from '$lib'
import txnOptions from '$lib/dgraph/txnOptions'
import { DgraphTransaction } from '$lib/global/dgraph'


export default async function getOrder (orderUid: string): Promise<Order | undefined> {
  const transaction = new DgraphTransaction({ ...txnOptions(), readOnly: true })

  const r = await transaction.query(true, `
    query {
      orders(func: uid(${ orderUid })) @filter(type(Order)) {
        uid
        name: Order.name
        addressLine1: Order.addressLine1
        addressLine2: Order.addressLine2
        city: Order.city
        state: Order.state
        country: Order.country
        zip: Order.zip
        email: Order.email
        orderItems: Order.orderItems {
          uid
          status: OrderItem.status
          size: OrderItem.size
          quantity: OrderItem.quantity
          refundAmount: OrderItem.refundAmount
          product: OrderItem.product {
            uid
          }
        }
      }
    }  
  `)

  return r?.data?.orders?.[0] as Order | undefined
}
