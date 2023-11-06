import dgraph from '$lib/dgraph/dgraph'
import type { OrderItem, Order } from '$lib'


function getSet (orderItem: OrderItem, order?: Order) {
 return  `set: { status: ${ orderItem.status }${ order?.shippingTrackingId && order?.shippingCarrier ? `, shippingTrackingId: "${ order.shippingTrackingId }", shippingCarrier: ${ order.shippingCarrier }` : '' } }`
}


export default async function updateOrderItems (orderItems: OrderItem[], order?: Order) {
  let args = ''

  if (orderItems.length === 1) args = `(input: {filter: {id: {eq: "${ orderItems[0].id }"}}, ${ getSet(orderItems[0], order) }})`
  else {
    let closingBrackets = ''

    args = '(input: {filter: {'

    for (let i = 0; i < orderItems.length; i++) {
      closingBrackets += '}'
      args += `id: {eq: "${ orderItems[i].id }"}`

      if (orderItems.length !== i + 1) args += ', or: {' // not the last order item
      else args += `${ closingBrackets }, ${ getSet(orderItems[i], order) }})`  // the last order item
    }
  }

  return dgraph({
    query: `
      mutation MyMutation {
        updateOrderItem${ args } {
          orderItem {
            id
            status
          }
        }
      }
    `
  })
}
