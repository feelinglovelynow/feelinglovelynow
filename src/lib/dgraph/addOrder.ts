import { dgraph } from '$lib/dgraph/dgraph'
import type { AddOrderRequestOrderItems, PrettyPaypal } from '$lib'


export default async function addOrder (paypalId: string, orderItems: AddOrderRequestOrderItems, pretty: PrettyPaypal): Promise<string> {
  let mutationOrderItems = '' // mutations for all the order items
  let mutationsLink = '' // mutations that link orders and order items

  for (let i = 0; i < orderItems.length; i++) { // loop order items
    // build mutation for adding the order item
    mutationOrderItems += `
      _:${ i } <dgraph.type> "OrderItem" .
      _:${ i } <OrderItem.quantity> "${ orderItems[i].quantity }" .
      _:${ i } <OrderItem.size> "${ orderItems[i].size || '' }" .
      _:${ i } <OrderItem.status> "${ orderItems[i].status }" .
      _:${ i } <OrderItem.product> <${ orderItems[i].product.uid }> .
    `

    mutationsLink += `_:order <Order.orderItems> _:${ i } . \n` // build mutation for linking the order with the order item
  }

  // add order items + order + link order w/ order items
  const r = await dgraph({ commitNow: true, mutation: `
    ${ mutationOrderItems }
    _:order <dgraph.type> "Order" .
    _:order <Order.paypalId> "${ paypalId }" .
    _:order <Order.email> "${ pretty.email }" .
    _:order <Order.name> "${ pretty.name }" .
    _:order <Order.addressLine1> "${ pretty.addressLine1 }" .
    _:order <Order.addressLine2> "${ pretty.addressLine2 }" .
    _:order <Order.city> "${ pretty.city }" .
    _:order <Order.zip> "${ pretty.zip }" .
    _:order <Order.country> "${ pretty.country }" .
    _:order <Order.paypalFee> "${ pretty.paypalFee.num }" .
    _:order <Order.totalPrice> "${ pretty.totalPrice.num }" .
    _:order <Order.createdAt> "${ (new Date()).toISOString() }" .
    _:order <Order.email> "${ pretty.email }" .
    ${ mutationsLink }
  `})

  return r?.data?.uids?.order
}
