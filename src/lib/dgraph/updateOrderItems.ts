import type { OrderItem } from '$lib'
import dgraph from '$lib/dgraph/dgraph'
import { enumOrderItemStatus } from '$lib/global/enums'


export default async function updateOrderItems (orderItems: OrderItem[]) {
  return Promise.all(orderItems.map(orderItem => {
    return dgraph({
      query: `
        mutation MyMutation {
          updateOrderItem${ getArgs(orderItem) } {
            numUids
          }
        }
      `
    })
  }))
}


function getArgs (orderItem: OrderItem) {
  switch(orderItem.status) {
    case enumOrderItemStatus.PURCHASED:
    case enumOrderItemStatus.PRINTFUL_PROCESSING: return `(input: {filter: {id: {eq: "${ orderItem.id }"}}, set: {status: ${ orderItem.status }}})`
    case enumOrderItemStatus.SHIPPING_TO_CUSTOMER: return `(input: {filter: {id: {eq: "${ orderItem.id }"}}, set: {status: ${ orderItem.status }, shippingTrackingId: "${ orderItem.shippingTrackingId }", shippingCarrier: ${ orderItem.shippingCarrier }}})`
  }
}
