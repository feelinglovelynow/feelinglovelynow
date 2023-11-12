import { json } from '@sveltejs/kit'
import Price from '$lib/store/Price'
import { one } from '$lib/catch/error'
import send from '$lib/mailchannels/send'
import getOrder from '$lib/dgraph/getOrder'
import type { RequestHandler } from './$types'
import IMG_LOTUS from '$lib/sacred/IMG_LOTUS.png'
import getHeader from '$lib/mailchannels/getHeader'
import getFooter from '$lib/mailchannels/getFooter'
import { enumOrderItemStatus } from '$lib/global/enums'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import updateOrderItems from '$lib/dgraph/updateOrderItems'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import type { Order, OrderItem, ReturnRequestSome } from '$lib'
import IMG_FRUIT_METATRON from '$lib/sacred/IMG_FRUIT_METATRON.png'
import getShippingTrackingHref from '$lib/store/getShippingTrackingHref'
import returnRequestSomeOrderItems from '$lib/dgraph/returnRequestSomeOrderItems'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userId) throw one('Unauthorized', { locals })
    else if (PUBLIC_ENVIRONMENT === 'local') throw one('Please do this at <a target="_blank" href="https://feelinglovelynow.com/admin">https://feelinglovelynow.com/admin</a> b/c this action requires emails to be sent', { locals })
    else {
      const bodyOrder = await request.json() as Order

      if (!bodyOrder.id) throw one('Please add an id to the request body', { bodyOrder })
      else {
        const justShipped: OrderItem[] = []
        const justRefunded: OrderItem[] = []
        const totalRefundAmount = new Price()
        const justPurchased: OrderItem[] = []
        const justDelivered: OrderItem[] = []
        const justPrintfulProcessed: OrderItem[] = []
        const justReturnRequestedAll: OrderItem[] = []
        const dgraphOrder = await getOrder(bodyOrder.id)
        const justStartedRefundProcessing: OrderItem[] = []
        const justReturnRequestedSome: ReturnRequestSome = []
        const mapDgraphOrderItems: Map<string, OrderItem> = new Map()

        for (const dgraphOrderItem of dgraphOrder.orderItems) { // place each dgraph order item into a map
          mapDgraphOrderItems.set(dgraphOrderItem.id, dgraphOrderItem)
        }

        for (const bodyOrderItem of bodyOrder.orderItems) { // loop body order items
          const dgraphOrderItem = mapDgraphOrderItems.get(bodyOrderItem.id) // find dgraph order item that aligns w/ body order item

          if (dgraphOrderItem) {
            // IF dgraph's order item status is not PURCHASED AND body's order item's status is PURCHASED => place bodyOrderItem into justPurchased array
            if (dgraphOrderItem.status !== enumOrderItemStatus.PURCHASED && bodyOrderItem.status === enumOrderItemStatus.PURCHASED) justPurchased.push(bodyOrderItem)

            // ELSE IF dgraph's order item status is not PRINTFUL_PROCESSING AND body's order item's status is PRINTFUL_PROCESSING => place bodyOrderItem into justPrintfulProcessed array
            else if (dgraphOrderItem.status !== enumOrderItemStatus.PRINTFUL_PROCESSING && bodyOrderItem.status === enumOrderItemStatus.PRINTFUL_PROCESSING) justPrintfulProcessed.push(bodyOrderItem)

            // ELSE IF dgraph's order item status is not SHIPPING_TO_CUSTOMER AND body's order item's status is SHIPPING_TO_CUSTOMER
            else if (dgraphOrderItem.status !== enumOrderItemStatus.SHIPPING_TO_CUSTOMER && bodyOrderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER) {
              validateShippingOrderItem(bodyOrderItem) // throws if invalid
              justShipped.push(bodyOrderItem) // place bodyOrderItem into justShipped array
            }

            // ELSE IF dgraph's order item status is not DELIVERED_TO_CUSTOMER AND body's order item's status is DELIVERED_TO_CUSTOMER
            else if (dgraphOrderItem.status !== enumOrderItemStatus.DELIVERED_TO_CUSTOMER && bodyOrderItem.status === enumOrderItemStatus.DELIVERED_TO_CUSTOMER) {
              validateShippingOrderItem(bodyOrderItem) // throws if invalid
              justDelivered.push(bodyOrderItem) // place bodyOrderItem into justDelivered array
            }

            // ELSE IF dgraph's order item status is not RETURN_REQUESTED AND body's order item's status is RETURN_REQUESTED
            else if (dgraphOrderItem.status !== enumOrderItemStatus.RETURN_REQUESTED && bodyOrderItem.status === enumOrderItemStatus.RETURN_REQUESTED) {
              validateRefundOrderItem({ bodyOrderItem, dgraphOrderItem, checkEqual: false }) // throws if invalid
              totalRefundAmount.add(bodyOrderItem.refundAmount || 0) // || 0 is just for typescript we know we'll have a refundAmount b/c of the validations above
              if (dgraphOrderItem.quantity === bodyOrderItem.quantity) justReturnRequestedAll.push(bodyOrderItem) // IF quantities match => place bodyOrderItem into justReturnRequestedAll array
              else justReturnRequestedSome.push({ dgraphOrderItem, bodyOrderItem }) // IF quantities do not match => place dgraphOrderItem AND bodyOrderItem into justReturnRequestedSome array
            }

            // ELSE IF dgraph's order item status is not REFUND_MONEY_PROCESSING AND body's order item's status is REFUND_MONEY_PROCESSING
            else if (dgraphOrderItem.status !== enumOrderItemStatus.REFUND_MONEY_PROCESSING && bodyOrderItem.status === enumOrderItemStatus.REFUND_MONEY_PROCESSING) {
              validateRefundOrderItem({ bodyOrderItem, dgraphOrderItem, checkEqual: true }) // throws if invalid
              justStartedRefundProcessing.push(bodyOrderItem) // place bodyOrderItem into justStartedRefundProcessing array
            }

            // ELSE IF dgraph's order item status is not REFUNDED AND body's order item's status is REFUNDED
            else if (dgraphOrderItem.status !== enumOrderItemStatus.REFUNDED && bodyOrderItem.status === enumOrderItemStatus.REFUNDED) {
              validateRefundOrderItem({ bodyOrderItem, dgraphOrderItem, checkEqual: true }) // throws if invalid
              justRefunded.push(bodyOrderItem) // place bodyOrderItem into justRefunded array
            }
          }
        }

        const newlyCreatedReturnRequestOrderItems = (justReturnRequestedSome.length) ? await returnRequestSomeOrderItems({ dgraphOrder, justReturnRequestedSome }) : []

        await Promise.all([
          (justShipped.length) ? updateOrderItems(justShipped) : Promise.resolve(),
          (justRefunded.length) ? updateOrderItems(justRefunded) : Promise.resolve(),
          (justPurchased.length) ? updateOrderItems(justPurchased) : Promise.resolve(),
          (justDelivered.length) ? updateOrderItems(justDelivered) : Promise.resolve(),
          (justPrintfulProcessed.length) ? updateOrderItems(justPrintfulProcessed) : Promise.resolve(),
          (justReturnRequestedAll.length) ? updateOrderItems(justReturnRequestedAll) : Promise.resolve(),
          (justStartedRefundProcessing.length) ? updateOrderItems(justStartedRefundProcessing) : Promise.resolve(),
          (justShipped.length || justDelivered.length || justPrintfulProcessed.length || justReturnRequestedAll.length || newlyCreatedReturnRequestOrderItems.length || justStartedRefundProcessing.length || justRefunded.length) && !dgraphOrder.email.includes('example.com') ?
            emailCustomer({ dgraphOrder, totalRefundAmount, justShipped, justDelivered, justPrintfulProcessed, justReturnRequestedAll, newlyCreatedReturnRequestOrderItems, justStartedRefundProcessing, justRefunded }) : Promise.resolve()
        ])

        return json({ success: true })
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler


async function emailCustomer ({ dgraphOrder, totalRefundAmount, justShipped, justDelivered, justPrintfulProcessed, justReturnRequestedAll, newlyCreatedReturnRequestOrderItems, justStartedRefundProcessing, justRefunded }: { dgraphOrder: Order, totalRefundAmount: Price, justShipped: OrderItem[], justDelivered: OrderItem[], justPrintfulProcessed: OrderItem[], justReturnRequestedAll: OrderItem[], newlyCreatedReturnRequestOrderItems: OrderItem[], justStartedRefundProcessing: OrderItem[], justRefunded: OrderItem[] }): Promise<number> {
  const justReturnRequested = newlyCreatedReturnRequestOrderItems.length ?
    justReturnRequestedAll.concat(newlyCreatedReturnRequestOrderItems) :
    justReturnRequestedAll

  return send({
    to: dgraphOrder.email,
    subject: '💚 Purchase Update from Feeling Lovely Now!',
    content: `
      <div style="padding: 18px 18px 27px 18px; font-size: 16px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial;">
        <div style="max-width: 444px; width: 100%; margin: 0 auto;">
          ${ getHeader() }
          ${ await getOrderItemHtml('justReturnRequested', 'Return Requested!', justReturnRequested) }
          ${ await getOrderItemHtml('justDelivered', 'Delivered!', justDelivered) }
          ${ await getOrderItemHtml('justShipped', 'Shipped!', justShipped) }
          ${ await getOrderItemHtml('justPrintfulProcessed', 'Creating!', justPrintfulProcessed) }
          ${ await getOrderItemHtml('justStartedRefundProcessing', 'Refund Processing!', justStartedRefundProcessing) }
          ${ await getOrderItemHtml('justRefunded', 'Refunded!', justRefunded) }
          ${ getUsAddress({ totalRefundAmount, justReturnRequested }) }
          ${ getShippingAddress({ dgraphOrder, justShipped, justDelivered, justPrintfulProcessed, justReturnRequested }) }
          ${ getFooter() }
        </div>
      </div>
    `
  })
}


async function getOrderItemHtml (key: 'justShipped' | 'justDelivered' | 'justPrintfulProcessed' | 'justReturnRequested' | 'justStartedRefundProcessing' | 'justRefunded', header: string, orderItems: OrderItem[]): Promise<string> {
  let orderItemsHtml = ''

  for (const orderItem of orderItems) {
    const quantityStr = `Quantity ${ orderItem.quantity }`
    const sizeStr = `${ orderItem.size ? ` ⋅ Size ${ orderItem.size }` : '' }`
    const justDeliveredStr = key === 'justDelivered' ? ' ⋅ Delivered!' : ''
    const justReturnRequestedStr = key === 'justReturnRequested' ? ' ⋅ Return Requested!' : ''
    const justPrintfulProcessedStr = key === 'justPrintfulProcessed' ? ' ⋅ Started Creating Shirts!' : ''

    const justRefundedStr = key === 'justRefunded' ? `
      <div style="color: #273142;">PayPal processed your <strong>$${ orderItem.refundAmount } USD</strong> refund for ${ orderItem.quantity === 1 ? 'this order item' : 'these order items' }!</div>
      ` : ''

    const justStartedRefundProcessingStr = key === 'justStartedRefundProcessing' ? `
      <div style="color: #273142;">PayPal is processing your <strong>$${ orderItem.refundAmount } USD</strong> refund for ${ orderItem.quantity === 1 ? 'this order item' : 'these order items' }!</div>
      ` : ''

    const shippingStr = (key === 'justShipped' || key === 'justDelivered') && orderItem.shippingCarrier && orderItem.shippingTrackingId ? `
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
            <div style="color: #273142; margin-bottom: 3px;">${ quantityStr }${ sizeStr }${ justPrintfulProcessedStr }${ justDeliveredStr }${ justReturnRequestedStr }</div>
            ${ shippingStr }
            ${ justStartedRefundProcessingStr }
            ${ justRefundedStr }
          </td>
        </tr>
      </table>
    `
  }

  return orderItemsHtml
}


function getShippingAddress ({ dgraphOrder, justShipped, justDelivered, justPrintfulProcessed, justReturnRequested }: { dgraphOrder: Order, justShipped: OrderItem[], justDelivered: OrderItem[], justPrintfulProcessed: OrderItem[], justReturnRequested: OrderItem[] }): string {
  let shippingAddress = ''

  if (justShipped.length || justDelivered.length || justPrintfulProcessed.length || justReturnRequested.length) {
    shippingAddress = `
      <table style="padding-top: 15px; margin-top: 18px; width: 100%; border-top: 1px solid rgba(206, 211, 214, 0.6);">
        <tr>
          <td>
            <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Shipping Address</div>
            <div style="line-height: 1.44;">
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
    `
  }

  return shippingAddress
}


function getUsAddress ({ totalRefundAmount, justReturnRequested }: { totalRefundAmount: Price, justReturnRequested: OrderItem[] }): string {
  let usAddress = ''

  if (justReturnRequested.length) {
    const pluralS = justReturnRequested.length > 1 || justReturnRequested[0].quantity > 1 ? 's' : ''

    usAddress = `
      <div style="color: #273142; font-weight: 500; margin-bottom: 3px;">Please send the return requested item${ pluralS } to our return address below! We will send you a refund through PayPal of <strong>$${ totalRefundAmount.str } USD</strong> once we recieve the item${ pluralS } at our return address below and validate the quality of the item${ pluralS } is good!</div>
      <table style="padding-top: 15px; margin-top: 18px; width: 100%; border-top: 1px solid rgba(206, 211, 214, 0.6);">
        <tr>
          <td>
            <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Our Return Address</div>

            <div style="line-height: 1.44;">
              <div style="color: #273142;">Chris Carrington</div>
              <div style="color: #273142;">404 N Mount Shasta Blvd #342</div>
              <div style="color: #273142;">Mount Shasta, CA, US 96067</div>
            </div>
          </td>
          <td style="text-align: right; padding-left: 9px;">
            <img style="width: 100%; max-width: 99px;" src="https://feelinglovelynow.com${ IMG_LOTUS }" />
          </td>
        </tr>
      </table>
    `
  }

  return usAddress
}


function validateShippingOrderItem (bodyOrderItem: OrderItem): void {
  if (!bodyOrderItem.shippingCarrier && !bodyOrderItem.shippingTrackingId) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
  if (!bodyOrderItem.shippingCarrier) throw one(`Please add shippingCarrier and shippingTrackingId for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
  if (!bodyOrderItem.shippingTrackingId) throw one(`Please add shippingTrackingId for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
}


function validateRefundOrderItem ({ bodyOrderItem, dgraphOrderItem, checkEqual }: { bodyOrderItem: OrderItem, dgraphOrderItem: OrderItem, checkEqual: boolean }): void {
  if (!bodyOrderItem.refundAmount) throw one(`Please add a refundAmount for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })
  if (!bodyOrderItem.quantity) throw one(`Please add a quantity for the order item ${ bodyOrderItem.product?.name }`, { bodyOrderItem })

  if (checkEqual && bodyOrderItem.quantity !== dgraphOrderItem.quantity) throw one(`Please add a quantity for the order item ${ bodyOrderItem.product?.name } that is equal to this order items current quantity which is ${ dgraphOrderItem.quantity }`, { bodyOrderItem, dgraphOrderItem })
  else if (bodyOrderItem.quantity > dgraphOrderItem.quantity) throw one(`Please add a quantity for the order item ${ bodyOrderItem.product?.name } that is less then this order items current quantity which is ${ dgraphOrderItem.quantity }`, { bodyOrderItem, dgraphOrderItem })
}
