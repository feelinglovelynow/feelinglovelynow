import { json } from '@sveltejs/kit'
import Price from '$lib/store/Price'
import { one } from '$lib/catch/error'
import send from '$lib/mailchannels/send'
import getOrder from '$lib/dgraph/getOrder'
import type { RequestHandler } from './$types'
import queryOrder from '$lib/dgraph/queryOrder'
import credentials from '$lib/dgraph/credentials'
import { DgraphTransaction } from '$lib/global/dgraph'
import IMG_LOTUS from '$lib/sacred/IMG_LOTUS.png'
import getHeader from '$lib/mailchannels/getHeader'
import getFooter from '$lib/mailchannels/getFooter'
import { enumOrderItemStatus } from '$lib/global/enums'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import updateOrderItems from '$lib/dgraph/updateOrderItems'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import IMG_FRUIT_METATRON from '$lib/sacred/IMG_FRUIT_METATRON.png'
import getShippingTrackingHref from '$lib/store/getShippingTrackingHref'
import returnRequestSomeOrderItems from '$lib/dgraph/returnRequestSomeOrderItems'
import type { Order, OrderItem, Product, ReturnRequestSome, UpdateOrderItemsRequest } from '$lib'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userUid) throw one('Unauthorized', { locals })
    // else if (PUBLIC_ENVIRONMENT === 'local') throw one('Please do this at <a target="_blank" href="https://feelinglovelynow.com/admin">https://feelinglovelynow.com/admin</a> b/c this action requires emails to be sent', { locals })
    else {
      const body = await request.json() as UpdateOrderItemsRequest

      if (!body.order.uid) throw one('Please add an id to the request body', { bodyOrder: body.order })
      else {
        const dgraphOrder = await getOrder(body.order.uid)

        if (!dgraphOrder) throw one('Please add an valid order.uid to the request body', { bodyOrder: body.order, dgraphOrder })
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
          let newlyCreatedReturnRequestOrderItemUids: string[] = []
          const mapDgraphOrderItems: Map<string, OrderItem> = new Map()

          for (const dgraphOrderItem of dgraphOrder.orderItems) { // place each dgraph order item into a map
            mapDgraphOrderItems.set(dgraphOrderItem.uid, dgraphOrderItem)
          }

          for (const bodyOrderItem of body.order.orderItems) { // loop body order items
            const dgraphOrderItem = mapDgraphOrderItems.get(bodyOrderItem.uid) // find dgraph order item that aligns w/ body order item

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
                totalRefundAmount.add(bodyOrderItem.refundAmount || 0) // || 0 is just for typescript but we know we'll have a refundAmount b/c of validateRefundOrderItem() above

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

          const transaction = new DgraphTransaction({ ...credentials() }) // start a transaction

          if (justShipped.length || justRefunded.length || justPurchased.length || justDelivered.length || justPrintfulProcessed.length || justReturnRequestedAll.length || justStartedRefundProcessing.length) {
            await transaction.mutate({ mutation: `
              ${ (justShipped.length) ? updateOrderItems(justShipped) : '' }
              ${ (justRefunded.length) ? updateOrderItems(justRefunded) : '' }
              ${ (justPurchased.length) ? updateOrderItems(justPurchased) : '' }
              ${ (justDelivered.length) ? updateOrderItems(justDelivered) : '' }
              ${ (justPrintfulProcessed.length) ? updateOrderItems(justPrintfulProcessed) : '' }
              ${ (justReturnRequestedAll.length) ? updateOrderItems(justReturnRequestedAll) : '' }
              ${ (justStartedRefundProcessing.length) ? updateOrderItems(justStartedRefundProcessing) : '' }
            `})
          }

          if (justReturnRequestedSome.length) { // if any order items have requested some (not all) of their quantity to be refunded => reflect in dgraph
            newlyCreatedReturnRequestOrderItemUids = await returnRequestSomeOrderItems({ transaction, dgraphOrder, justReturnRequestedSome })
          }

          const freshOrders = await queryOrder(transaction, false, body.search)

          await transaction.commit() // commit the transaction if we made it this far w/o an error

          const newlyCreatedReturnRequestOrderItems: OrderItem[] = setNewlyCreatedReturnRequestOrderItems(newlyCreatedReturnRequestOrderItemUids, freshOrders, dgraphOrder, body.order)

          if ((justShipped.length || justDelivered.length || justPrintfulProcessed.length || justReturnRequestedAll.length || newlyCreatedReturnRequestOrderItems?.length || justStartedRefundProcessing.length || justRefunded.length) && !dgraphOrder.email.includes('example.com')) {
            await emailCustomer({
              dgraphOrder,
              totalRefundAmount,
              justShipped,
              justDelivered,
              justPrintfulProcessed,
              justReturnRequestedAll,
              justStartedRefundProcessing,
              justRefunded,
              newlyCreatedReturnRequestOrderItems
            })
          }

          return json(freshOrders)
        }
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler


function setNewlyCreatedReturnRequestOrderItems (newlyCreatedReturnRequestOrderItemUids: string[], freshOrders: Order[], dgraphOrder: Order, bodyOrder: Order): OrderItem[] {
  const newlyCreatedReturnRequestOrderItems: OrderItem[] = []
  
  if (newlyCreatedReturnRequestOrderItemUids.length) {
    const freshOrder = freshOrders.find(o => o.uid === dgraphOrder.uid) // get order from recent queryOrder()

    if (freshOrder) {
      const productMap = new Map<string, Product>()
      const orderItemMap = new Map<string, OrderItem>()

      if (PUBLIC_ENVIRONMENT !== 'main') { // only main has the products so we need to get the products from body
        for (const orderItem of bodyOrder.orderItems) {
          if (orderItem.product) productMap.set(orderItem.product.uid, orderItem.product)
        }
      }

      for (const orderItem of freshOrder.orderItems) { // put orderItems in a map
        orderItemMap.set(orderItem.uid, orderItem)
      }

      for (const uid of newlyCreatedReturnRequestOrderItemUids) { // loop uids => aling uids w/ fresh order items
        const mapItem = orderItemMap.get(uid)

        if (mapItem) {
          if (PUBLIC_ENVIRONMENT !== 'main' && mapItem.product) { // only main has products so use the product from the body
            mapItem.product = productMap.get(mapItem.product.uid)
          }

          newlyCreatedReturnRequestOrderItems.push(mapItem)
        }

      }
    }
  }

  return newlyCreatedReturnRequestOrderItems
}


async function emailCustomer ({ dgraphOrder, totalRefundAmount, justShipped, justDelivered, justPrintfulProcessed, justReturnRequestedAll, newlyCreatedReturnRequestOrderItems, justStartedRefundProcessing, justRefunded }: { dgraphOrder: Order, totalRefundAmount: Price, justShipped: OrderItem[], justDelivered: OrderItem[], justPrintfulProcessed: OrderItem[], justReturnRequestedAll: OrderItem[], newlyCreatedReturnRequestOrderItems: OrderItem[], justStartedRefundProcessing: OrderItem[], justRefunded: OrderItem[] }): Promise<number> {
  const justReturnRequested = newlyCreatedReturnRequestOrderItems.length ? // if any items have been newly created b/c some of the itmes were refunded
    justReturnRequestedAll.concat(newlyCreatedReturnRequestOrderItems) : // add newly created items to array of items where all the quantities wanted to be refunded
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
            <img style="width: 126px; height: auto;" src="https://feelinglovelynow.com${ (await import(`../../../lib/img/store/${ orderItem.product?.primaryImage.uid }.${ orderItem.product?.primaryImage.extension }`)).default }" alt="${ orderItem.product?.name }">
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
