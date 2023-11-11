import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import send from '$lib/mailchannels/send'
import getOrder from '$lib/dgraph/getOrder'
import type { Order, OrderItem } from '$lib'
import type { RequestHandler } from './$types'
import { enumOrderItemStatus } from '$lib/global/enums'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import updateOrderItems from '$lib/dgraph/updateOrderItems'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import IMG_EMAIL_HEAD from '$lib/img/email/IMG_EMAIL_HEAD.png'
import getShippingTrackingHref from '$lib/store/getShippingTrackingHref'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userId) throw one('Unauthorized', { locals })
    else if (PUBLIC_ENVIRONMENT === 'local') throw one('Please do this at <a target="_blank" href="https://feelinglovelynow.com/admin">https://feelinglovelynow.com/admin</a> b/c this action requires emails to be sent', { locals })
    else {
      const bodyOrder = await request.json() as Order

      if (!bodyOrder.id) throw one('Please add an id to the request body', { bodyOrder })
      else {
        const justShipped: OrderItem[] = []
        const justPurchased: OrderItem[] = []
        const justPrintfulProcessed: OrderItem[] = []
        const mapDgraphOrderItems: Map<string, OrderItem> = new Map()
        const dgraphOrder = await getOrder(bodyOrder.id) // get order by id

        for (const dgraphOrderItem of dgraphOrder.orderItems) { // place each dgraph order item into a map
          mapDgraphOrderItems.set(dgraphOrderItem.id, dgraphOrderItem)
        }

        for (const bodyOrderItem of bodyOrder.orderItems) { // loop body order items
          const dgraphOrderItem = mapDgraphOrderItems.get(bodyOrderItem.id) // find dgraph order item that aligns w/ body order item

          if (dgraphOrderItem) {
            // IF dgraph's order item status is PURCHASED AND body's order item's status is PRINTFUL_PROCESSING => place bodyOrderItem into justPrintfulProcessed array
            if (dgraphOrderItem.status === enumOrderItemStatus.PURCHASED && bodyOrderItem.status === enumOrderItemStatus.PRINTFUL_PROCESSING) justPrintfulProcessed.push(bodyOrderItem)

            // ELSE IF dgraph's order item status is (PURCHASED || PRINTFUL_PROCESSING) AND body's order item's status is SHIPPING_TO_CUSTOMER => place bodyOrderItem into justShipped array
            else if ((dgraphOrderItem.status === enumOrderItemStatus.PURCHASED || dgraphOrderItem.status === enumOrderItemStatus.PRINTFUL_PROCESSING) && bodyOrderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER) justShipped.push(bodyOrderItem)
          
            // IF dgraph's order item status is not PURCHASED AND body's order item's status is PURCHASED => place bodyOrderItem into justPurchased array
            if (dgraphOrderItem.status !== enumOrderItemStatus.PURCHASED && bodyOrderItem.status === enumOrderItemStatus.PURCHASED) justPurchased.push(bodyOrderItem)
          }
        }

        if (justShipped.length) {
          for (const orderItem of justShipped) {
            if (!orderItem.shippingCarrier && !orderItem.shippingTrackingId) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ orderItem.product?.name }`, { body: bodyOrder, orderItem })
            if (!orderItem.shippingCarrier) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ orderItem.product?.name }`, { body: bodyOrder, orderItem })
            if (!orderItem.shippingTrackingId) throw one(`Please add shippingTrackingId for the order item ${ orderItem.product?.name }`, { body: bodyOrder, orderItem })
          }
        }

        await Promise.all([
          (justShipped.length) ? updateOrderItems(justShipped) : Promise.resolve(),
          (justPurchased.length) ? updateOrderItems(justPurchased) : Promise.resolve(),
          (justPrintfulProcessed.length) ? updateOrderItems(justPrintfulProcessed) : Promise.resolve(),
          (justPrintfulProcessed.length || justShipped.length) && !dgraphOrder.email.includes('example.com') ? emailCustomer({ dgraphOrder, justShipped, justPrintfulProcessed }) : Promise.resolve()
        ])

        return json({ success: true })
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler


async function emailCustomer ({ dgraphOrder, justShipped, justPrintfulProcessed }: { dgraphOrder: Order, justShipped: OrderItem[], justPrintfulProcessed: OrderItem[] }) {
  send({
    to: dgraphOrder.email,
    subject: '💚 Purchase Update from Feeling Lovely Now!',
    content: `
      <div style="padding: 18px 18px 27px 18px; font-size: 16px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial;">
        <div style="max-width: 444px; width: 100%; margin: 0 auto;">
          <div style="height: 90px; width: 100%; text-align: center;">
            <img style="width: 280px; padding-right: 9px;" src="https://feelinglovelynow.com${ IMG_EMAIL_HEAD }" alt="logo" />
          </div>

          ${ await getOrderItemHtml('justShipped', 'Shipped!', justShipped) }
          ${ await getOrderItemHtml('justPrintfulProcessed', 'Creating!', justPrintfulProcessed) }
        </div>
      </div>
      <div style="display: none;">${ crypto.randomUUID() }</div>
    `
  })
}


async function getOrderItemHtml (key: 'justShipped' | 'justPrintfulProcessed', header: string, orderItems: OrderItem[]) {
  let orderItemsHtml = ''

  for (const orderItem of orderItems) {
    const quantityStr = `Quantity ${ orderItem.quantity }`
    const sizeStr = `${ orderItem.size ? ` ⋅ Size ${ orderItem.size }` : '' }`
    const justPrintfulProcessedStr = orderItems.length && key === 'justPrintfulProcessed' ? ' ⋅ Started Creating Shirts!' : ''
    const justShippedStr = orderItems.length && key === 'justShipped' && orderItem.shippingCarrier && orderItem.shippingTrackingId ? `
      <div style="color: #273142; margin-bottom: 3px;">Shipping Carrier: ${ orderItem.shippingCarrier }</div>
      <div style="color: #273142; margin-bottom: 3px;">Shipping Tracking Id: ${ orderItem.shippingTrackingId }</div>
      <div style="color: #273142;"><a target="_blank" href="${ getShippingTrackingHref(orderItem.shippingCarrier, orderItem.shippingTrackingId) }">Click here to track your order item${ orderItem.quantity > 1 ? 's' : '' }</a></div>
    ` : ''

    orderItemsHtml += `
      <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">${ header }</div>
      <table style="width: 100%; margin-bottom: 15px;">
        <tr>
          <td style="width: 126px; vertical-align: top;">
            <img style="width: 126px; height: auto;" src="https://feelinglovelynow.com${ (await import(`../../../lib/img/store/${ orderItem.product?.primaryImage.id }.${ orderItem.product?.primaryImage.extension }`)).default }" alt="${ orderItem.product?.name }">
          </td>
          <td style="color: #273142;padding: 3px 0 0 9px; vertical-align: top;">
            <div style="color: #273142; font-weight: 600; margin-bottom: 3px;">${ orderItem.product?.name }</div>
            <div style="color: #273142; margin-bottom: 3px;">${ quantityStr }${ sizeStr }${ justPrintfulProcessedStr }</div>
            ${ justShippedStr }
          </td>
        </tr>
      </table>
    `
  }

  return orderItemsHtml
}
