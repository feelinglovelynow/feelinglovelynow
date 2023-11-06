import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import getOrder from '$lib/dgraph/getOrder'
import type { Order, OrderItem } from '$lib'
import type { RequestHandler } from './$types'
import { enumOrderItemStatus } from '$lib/util/enums'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import updateOrderItems from '$lib/dgraph/updateOrderItems'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userId) throw one('Unauthorized', { locals })
    else if (PUBLIC_ENVIRONMENT === 'local') throw one('Please do this at <a target="_blank" href="https://feelinglovelynow.com/admin">https://feelinglovelynow.com/admin</a> b/c this action requires emails to be sent', { locals })
    else {
      const bodyOrder = await request.json() as Order

      if (!bodyOrder.id) throw one('Please add an id to the request body', { bodyOrder })
      else {
        const justShipped: OrderItem[] = []
        const justPrintfulProcessed: OrderItem[] = []
        const mapDgraphOrderItems: Map<string, OrderItem> = new Map()
        const dgraphOrder = await getOrder(bodyOrder.id) // get order by id

        for (const dgraphOrderItem of dgraphOrder.orderItems) { // place each dgraph order item into a map
          mapDgraphOrderItems.set(dgraphOrderItem.id, dgraphOrderItem)
        }

        for (const bodyOrderItem of bodyOrder.orderItems) { // loop body order items
          const dgraphOrderItem = mapDgraphOrderItems.get(bodyOrderItem.id) // find dgraph order item that aligns w/ body order item

          if (dgraphOrderItem) {
            // IF dgraph's order item status is PURCHASED AND body's order item status is requesting a new status of PRINTFUL_PROCESSING => place bodyOrderItem into justPrintfulProcessed array
            if (dgraphOrderItem.status === enumOrderItemStatus.PURCHASED && bodyOrderItem.status === enumOrderItemStatus.PRINTFUL_PROCESSING) justPrintfulProcessed.push(bodyOrderItem)

            // ELSE IF dgraph's order item status is (PURCHASED || PRINTFUL_PROCESSING) AND body's order item status is requesting a new status of SHIPPING_TO_CUSTOMER => place bodyOrderItem into justShipped array
            else if ((dgraphOrderItem.status === enumOrderItemStatus.PURCHASED || dgraphOrderItem.status === enumOrderItemStatus.PRINTFUL_PROCESSING) && bodyOrderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER) justShipped.push(bodyOrderItem)
          }
        }

        if (justShipped.length) {
          if (!bodyOrder.shippingCarrier && !bodyOrder.shippingTrackingId) throw one('Please add shippingCarrier and shippingTrackingId to the request', { body: bodyOrder })
          if (!bodyOrder.shippingCarrier) throw one('Please add a shippingCarrier to the request', { body: bodyOrder })
          if (!bodyOrder.shippingTrackingId) throw one('Please add a shippingTrackingId to the request', { body: bodyOrder })
        }

        await Promise.all([
          (justShipped.length) ? updateOrderItems(justShipped, bodyOrder) : Promise.resolve(),
          (justPrintfulProcessed.length) ? updateOrderItems(justPrintfulProcessed) : Promise.resolve()
        ])

        return json({ success: true })
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
