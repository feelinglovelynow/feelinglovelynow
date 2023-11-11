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
import IMG_FRUIT_METATRON from '$lib/sacred/IMG_FRUIT_METATRON.png'
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
        const justDelivered: OrderItem[] = []
        const justPrintfulProcessed: OrderItem[] = []
        const mapDgraphOrderItems: Map<string, OrderItem> = new Map()
        const dgraphOrder = await getOrder(bodyOrder.id) // get order by id

        for (const dgraphOrderItem of dgraphOrder.orderItems) { // place each dgraph order item into a map
          mapDgraphOrderItems.set(dgraphOrderItem.id, dgraphOrderItem)
        }

        for (const bodyOrderItem of bodyOrder.orderItems) { // loop body order items
          const dgraphOrderItem = mapDgraphOrderItems.get(bodyOrderItem.id) // find dgraph order item that aligns w/ body order item

          if (dgraphOrderItem) {
            // IF dgraph's order item status is not PRINTFUL_PROCESSING AND body's order item's status is PRINTFUL_PROCESSING => place bodyOrderItem into justPrintfulProcessed array
            if (dgraphOrderItem.status !== enumOrderItemStatus.PRINTFUL_PROCESSING && bodyOrderItem.status === enumOrderItemStatus.PRINTFUL_PROCESSING) justPrintfulProcessed.push(bodyOrderItem)

            // ELSE IF dgraph's order item status is not SHIPPING_TO_CUSTOMER AND body's order item's status is SHIPPING_TO_CUSTOMER => place bodyOrderItem into justShipped array
            else if (dgraphOrderItem.status !== enumOrderItemStatus.SHIPPING_TO_CUSTOMER && bodyOrderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER) justShipped.push(bodyOrderItem)
          
            // ELSE IF dgraph's order item status is not PURCHASED AND body's order item's status is PURCHASED => place bodyOrderItem into justPurchased array
            else if (dgraphOrderItem.status !== enumOrderItemStatus.PURCHASED && bodyOrderItem.status === enumOrderItemStatus.PURCHASED) justPurchased.push(bodyOrderItem)
          
            // ELSE IF dgraph's order item status is not DELIVERED_TO_CUSTOMER AND body's order item's status is DELIVERED_TO_CUSTOMER => place bodyOrderItem into justDelivered array
            else if (dgraphOrderItem.status !== enumOrderItemStatus.DELIVERED_TO_CUSTOMER && bodyOrderItem.status === enumOrderItemStatus.DELIVERED_TO_CUSTOMER) justDelivered.push(bodyOrderItem)
          }
        }

        shippingValidation(justShipped, bodyOrder)
        shippingValidation(justDelivered, bodyOrder)

        await Promise.all([
          (justShipped.length) ? updateOrderItems(justShipped) : Promise.resolve(),
          (justPurchased.length) ? updateOrderItems(justPurchased) : Promise.resolve(),
          (justDelivered.length) ? updateOrderItems(justDelivered) : Promise.resolve(),
          (justPrintfulProcessed.length) ? updateOrderItems(justPrintfulProcessed) : Promise.resolve(),
          (justPrintfulProcessed.length || justShipped.length) && !dgraphOrder.email.includes('example.com') ? emailCustomer({ dgraphOrder, justShipped, justDelivered, justPrintfulProcessed }) : Promise.resolve()
        ])

        return json({ success: true })
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler


async function emailCustomer ({ dgraphOrder, justShipped, justDelivered, justPrintfulProcessed }: { dgraphOrder: Order, justShipped: OrderItem[], justDelivered: OrderItem[], justPrintfulProcessed: OrderItem[] }) {
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
          ${ await getOrderItemHtml('justDelivered', 'Delivered!', justDelivered) }
          ${ await getOrderItemHtml('justPrintfulProcessed', 'Creating!', justPrintfulProcessed) }

          <table style="margin-top: 18px; width: 100%; border-top: 1px solid rgba(206, 211, 214, 0.6);">
            <tr>
              <td>
                <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Shipping Address</div>
                <div style="line-height: 1.45;">
                  <div style="color: #273142;">${ dgraphOrder.name }</div>
                  <div style="color: #273142;">${ dgraphOrder.addressLine1 } ${ dgraphOrder.addressLine2 || '' }</div>
                  <div style="color: #273142;">${ dgraphOrder.city }, ${ dgraphOrder.state }, ${ dgraphOrder.country } ${ dgraphOrder.zip }</div>
                </div>
              </td>
              <td style="text-align: right; padding-left: 9px;">
                <img style="width: 100%; max-width: 99px;" src="https://feelinglovelynow.com${ IMG_FRUIT_METATRON }" />
              </td>
            </tr>
          </table>          
        </div>
      </div>
      <div style="display: none;">${ crypto.randomUUID() }</div>
    `
  })
}


async function getOrderItemHtml (key: 'justShipped' | 'justDelivered' | 'justPrintfulProcessed', header: string, orderItems: OrderItem[]) {
  let orderItemsHtml = ''

  for (const orderItem of orderItems) {
    const quantityStr = `Quantity ${ orderItem.quantity }`
    const sizeStr = `${ orderItem.size ? ` ⋅ Size ${ orderItem.size }` : '' }`
    const justDeliveredStr = orderItems.length && key === 'justDelivered' ? ' ⋅ Delivered!' : ''
    const justPrintfulProcessedStr = orderItems.length && key === 'justPrintfulProcessed' ? ' ⋅ Started Creating Shirts!' : ''
    const shippingStr = orderItems.length && (key === 'justShipped' || key === 'justDelivered') && orderItem.shippingCarrier && orderItem.shippingTrackingId ? `
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
            <div style="color: #273142; margin-bottom: 3px;">${ quantityStr }${ sizeStr }${ justPrintfulProcessedStr }${ justDeliveredStr }</div>
            ${ shippingStr }
          </td>
        </tr>
      </table>
    `
  }

  return orderItemsHtml
}


function shippingValidation (orderItems: OrderItem[], bodyOrder: Order) {
    if (orderItems.length) {
    for (const orderItem of orderItems) {
      if (!orderItem.shippingCarrier && !orderItem.shippingTrackingId) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ orderItem.product?.name }`, { body: bodyOrder, orderItem })
      if (!orderItem.shippingCarrier) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ orderItem.product?.name }`, { body: bodyOrder, orderItem })
      if (!orderItem.shippingTrackingId) throw one(`Please add shippingTrackingId for the order item ${ orderItem.product?.name }`, { body: bodyOrder, orderItem })
    }
  }
}
