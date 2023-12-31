import type { OrderItem } from '$lib'
import { enumOrderItemStatus } from '$lib/global/enums'


export default function updateOrderItems (orderItems: OrderItem[]): string {
  let mutation = ''

  for (const orderItem of orderItems) {
    mutation += getMutation(orderItem)
  }

  return mutation
}


function getMutation (orderItem: OrderItem) {
  switch(orderItem.status) {
    case enumOrderItemStatus.PURCHASED:
    case enumOrderItemStatus.PRINTFUL_PROCESSING:
      return `<${ orderItem.uid }> <OrderItem.status> "${ orderItem.status }" . \n`

    case enumOrderItemStatus.SHIPPING_TO_CUSTOMER:
    case enumOrderItemStatus.DELIVERED_TO_CUSTOMER:
      return `<${ orderItem.uid }> <OrderItem.status> "${ orderItem.status }" . \n<${ orderItem.uid }> <OrderItem.shippingTrackingId> "${ orderItem.shippingTrackingId }" . \n<${ orderItem.uid }> <OrderItem.shippingCarrier> "${ orderItem.shippingCarrier }" . \n`

    case enumOrderItemStatus.REFUNDED:
    case enumOrderItemStatus.RETURN_REQUESTED: 
    case enumOrderItemStatus.REFUND_MONEY_PROCESSING:
      return `<${ orderItem.uid }> <OrderItem.status> "${ orderItem.status }" . \n<${ orderItem.uid }> <OrderItem.refundAmount> "${ orderItem.refundAmount }" . \n`
  }
}
