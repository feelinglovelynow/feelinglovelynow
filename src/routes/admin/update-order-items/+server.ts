import { ace, td } from '@ace/db'
import { json } from '@sveltejs/kit'
import Price from '$lib/store/Price'
import { getOrder } from '$lib/ace/getOrder'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import { queryOrder } from '$lib/ace/queryOrder'
import { one } from '@feelinglovelynow/svelte-catch'
import { enumOrderItemStatus } from '$lib/global/enums'
import { ACE_DIRECTORY, ACE_ENVIRONMENT } from '$env/static/private'
import type { OrderItem, ReturnRequestSome, UpdateOrderItemsRequest } from '$lib'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userId) throw one('Unauthorized', { locals })
    else {
      const body = await request.json() as UpdateOrderItemsRequest

      if (!body.order.id) throw one('Please add an id to the request body', { bodyOrder: body.order })
      else {
        const graphOrder = await getOrder(body.order.id)

        if (!graphOrder?.id) throw one('Please add an valid order.id to the request body', { bodyOrder: body.order, graphOrder })
        else {
          const justShipped: OrderItem[] = []
          const justRefunded: OrderItem[] = []
          const totalRefundAmount = new Price()
          const justPurchased: OrderItem[] = []
          const justDelivered: OrderItem[] = []
          const justPrintfulProcessed: OrderItem[] = []
          const justReturnRequestedAll: OrderItem[] = []
          const justStartedRefundProcessing: OrderItem[] = []
          const justReturnRequestedSome: ReturnRequestSome[] = []
          const mapGraphOrderItems: Map<number, OrderItem> = new Map()

          if (graphOrder.items) {
            for (const gaphOrderItem of graphOrder.items) { // place each graph order item into a map
              if (gaphOrderItem?.id) mapGraphOrderItems.set(gaphOrderItem.id, gaphOrderItem)
            }
          }

          if (body.order.items) {
            for (const bodyOrderItem of body.order.items) { // loop body order items
              const graphOrderItem = bodyOrderItem.id ? mapGraphOrderItems.get(bodyOrderItem.id) : null // find graph order item that aligns w/ body order item

              if (graphOrderItem) {
                // IF graph's order item status is not PURCHASED AND body's order item's status is PURCHASED => place bodyOrderItem into justPurchased array
                if (graphOrderItem.status !== enumOrderItemStatus.PURCHASED && bodyOrderItem.status === enumOrderItemStatus.PURCHASED) justPurchased.push(bodyOrderItem)

                // ELSE IF graph's order item status is not PRINTFUL_PROCESSING AND body's order item's status is PRINTFUL_PROCESSING => place bodyOrderItem into justPrintfulProcessed array
                else if (graphOrderItem.status !== enumOrderItemStatus.PRINTFUL_PROCESSING && bodyOrderItem.status === enumOrderItemStatus.PRINTFUL_PROCESSING) justPrintfulProcessed.push(bodyOrderItem)

                // ELSE IF graph's order item status is not SHIPPING_TO_CUSTOMER AND body's order item's status is SHIPPING_TO_CUSTOMER
                else if (graphOrderItem.status !== enumOrderItemStatus.SHIPPING_TO_CUSTOMER && bodyOrderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER) {
                  validateShippingOrderItem(bodyOrderItem) // throws if invalid
                  justShipped.push(bodyOrderItem) // place bodyOrderItem into justShipped array
                }

                // ELSE IF graph's order item status is not DELIVERED_TO_CUSTOMER AND body's order item's status is DELIVERED_TO_CUSTOMER
                else if (graphOrderItem.status !== enumOrderItemStatus.DELIVERED_TO_CUSTOMER && bodyOrderItem.status === enumOrderItemStatus.DELIVERED_TO_CUSTOMER) {
                  validateShippingOrderItem(bodyOrderItem) // throws if invalid
                  justDelivered.push(bodyOrderItem) // place bodyOrderItem into justDelivered array
                }

                // ELSE IF graph's order item status is not RETURN_REQUESTED AND body's order item's status is RETURN_REQUESTED
                else if (graphOrderItem.status !== enumOrderItemStatus.RETURN_REQUESTED && bodyOrderItem.status === enumOrderItemStatus.RETURN_REQUESTED) {
                  validateRefundOrderItem({ bodyOrderItem, graphOrderItem, checkEqual: false }) // throws if invalid
                  totalRefundAmount.add(bodyOrderItem.refundAmount || 0) // || 0 is just for typescript but we know we'll have a refundAmount b/c of validateRefundOrderItem() above

                  if (graphOrderItem.quantity === bodyOrderItem.quantity) justReturnRequestedAll.push(bodyOrderItem) // IF quantities match => place bodyOrderItem into justReturnRequestedAll array
                  else justReturnRequestedSome.push({ graphOrderItem, bodyOrderItem }) // IF quantities do not match => place graphOrderItem AND bodyOrderItem into justReturnRequestedSome array
                }

                // ELSE IF graph's order item status is not REFUND_MONEY_PROCESSING AND body's order item's status is REFUND_MONEY_PROCESSING
                else if (graphOrderItem.status !== enumOrderItemStatus.REFUND_MONEY_PROCESSING && bodyOrderItem.status === enumOrderItemStatus.REFUND_MONEY_PROCESSING) {
                  validateRefundOrderItem({ bodyOrderItem, graphOrderItem, checkEqual: true }) // throws if invalid
                  justStartedRefundProcessing.push(bodyOrderItem) // place bodyOrderItem into justStartedRefundProcessing array
                }

                // ELSE IF graph's order item status is not REFUNDED AND body's order item's status is REFUNDED
                else if (graphOrderItem.status !== enumOrderItemStatus.REFUNDED && bodyOrderItem.status === enumOrderItemStatus.REFUNDED) {
                  validateRefundOrderItem({ bodyOrderItem, graphOrderItem, checkEqual: true }) // throws if invalid
                  justRefunded.push(bodyOrderItem) // place bodyOrderItem into justRefunded array
                }
              }
            }
          }

          const req: td.AceFnRequestItem[] = []

          if (justShipped.length) updateOrderItemStatus(justShipped)
          if (justRefunded.length) updateOrderItemStatus(justRefunded)
          if (justPurchased.length) updateOrderItemStatus(justPurchased)
          if (justDelivered.length) updateOrderItemStatus(justDelivered)
          if (justPrintfulProcessed.length) updateOrderItemStatus(justPrintfulProcessed)
          if (justReturnRequestedAll.length) updateOrderItemStatus(justReturnRequestedAll)
          if (justStartedRefundProcessing.length) updateOrderItemStatus(justStartedRefundProcessing)


          function updateOrderItemStatus (array: OrderItem[]) {
            if (array.length) {
              for (const orderItem of array) {
                if (orderItem.id) req.push({ do: 'NodeUpdate', how: { node: 'OrderItem', props: { id: orderItem.id, status: orderItem.status }} })
              }
            }
          }

          if (justReturnRequestedSome.length) { // if any order items have requested some (not all) of their quantity to be refunded => reflect in graph
            for (let i = 0; i < justReturnRequestedSome.length; i++) {
              // 1) Update original order item quantity
              req.push({ do: 'NodeUpdate', how: { node: 'OrderItem', props: { id: justReturnRequestedSome[i].graphOrderItem.id, quantity: justReturnRequestedSome[i].graphOrderItem.quantity - justReturnRequestedSome[i].bodyOrderItem.quantity }} })
            
              // 2) Add new orderItem
              req.push({
                do: 'NodeInsert',
                how: {
                  node: 'OrderItem',
                  props: {
                    id: '_:justReturnRequestedSome' + i,
                    status: enumOrderItemStatus.RETURN_REQUESTED,
                    quantity: justReturnRequestedSome[i].bodyOrderItem.quantity,
                    refundAmount: justReturnRequestedSome[i].bodyOrderItem.refundAmount,
                    size: justReturnRequestedSome[i].graphOrderItem.size,

                  }
                }
              })

              // 3) Add product to new order item
              req.push({ do: 'RelationshipInsert', how: { relationship: 'orderItemProduct', props: { a: '_:justReturnRequestedSome' + i, b: justReturnRequestedSome[i].graphOrderItem.product.id } }})

              // 4) Add new order item to order
              req.push({ do: 'RelationshipInsert', how: { relationship: 'orderOrderItems', props: { a: graphOrder.id, b: '_:justReturnRequestedSome' + i } }})
            }
          }

          await ace({ dir: ACE_DIRECTORY, env: ACE_ENVIRONMENT, req })
          return json(await queryOrder(body.search))
        }
      }
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler



function validateShippingOrderItem (bodyOrderItem: OrderItem): void {
  if (!bodyOrderItem.shippingCarrier && !bodyOrderItem.shippingTrackingId) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
  if (!bodyOrderItem.shippingCarrier) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
  if (!bodyOrderItem.shippingTrackingId) throw one(`Please add shippingTrackingId for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
}


function validateRefundOrderItem ({ bodyOrderItem, graphOrderItem, checkEqual }: { bodyOrderItem: OrderItem, graphOrderItem: OrderItem, checkEqual: boolean }): void {
  if (!bodyOrderItem.refundAmount) throw one(`Please add a refundAmount for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
  if (!bodyOrderItem.quantity) throw one(`Please add a quantity for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })

  if (checkEqual && bodyOrderItem.quantity !== graphOrderItem.quantity) throw one(`Please add a quantity for the order item ${ bodyOrderItem.product?.name } that is equal to this order items current quantity which is ${ graphOrderItem.quantity }`, { bodyOrderItem, graphOrderItem })
  else if (typeof graphOrderItem.quantity === 'number' && bodyOrderItem.quantity > graphOrderItem.quantity) throw one(`Please add a quantity for the order item ${ bodyOrderItem.product?.name } that is less then this order items current quantity which is ${ graphOrderItem.quantity }`, { bodyOrderItem, graphOrderItem })
}
