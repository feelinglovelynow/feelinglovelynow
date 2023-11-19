import { dgraph } from '$lib/dgraph/dgraph'
import type { Order, SearchOrdersRequest } from '$lib'
import type { DgraphTransaction } from '$lib/global/dgraph/transaction'


export default async function queryOrder (transaction: DgraphTransaction | null, { uid, email, startDate, endDate }: SearchOrdersRequest): Promise<Order[]> {
  let filter = ''

  if (uid) filter = `@filter(uid(${ uid }))`
  else if (email) filter = `@filter(eq(Order.email, "${ email }"))`
  else if (startDate && endDate) filter = ` @filter(between(Order.createdAt, "${ (new Date(startDate)).toISOString() }", "${ (new Date(endDate)).toISOString() }"))`

  const params = transaction ? { transaction } : { readOnly: true, discardTxn: true }

  const r = await dgraph({ ...params, query: `
    query {
      orders(func: type(Order), orderdesc: Order.createdAt) ${ filter } {
        uid
        createdAt: Order.createdAt
        name: Order.name
        addressLine1: Order.addressLine1
        addressLine2: Order.addressLine2
        city: Order.city
        state: Order.state
        country: Order.country
        zip: Order.zip
        email: Order.email
        totalPrice: Order.totalPrice
        orderItems: Order.orderItems {
          uid
          status: OrderItem.status
          size: OrderItem.size
          quantity: OrderItem.quantity
          refundAmount: OrderItem.refundAmount
          shippingCarrier: OrderItem.shippingCarrier
          shippingTrackingId: OrderItem.shippingTrackingId
          product: OrderItem.product {
            uid
            slug: Product.slug
            name: Product.name
            primaryImage: Product.primaryImage {
              uid
              extension: Image.extension
            }
          }
        }
      }
    }
  `})

  return r?.data?.orders as Order[]
}
