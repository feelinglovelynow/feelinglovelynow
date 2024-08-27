import type { Order } from '$lib/ace/ace.d'
import type { Cart } from '$lib/store/store.d'


export type SearchOrdersRequest = {
  id?: number
  email?: string
  startDate?: string
  endDate?: string
}

export type UpdateOrderItemsRequest = {
  order: Order
  search: SearchOrdersRequest
}

export type CreateOrderRequest = {
  cart: Cart
  totalPrice: Price
}

export type CaptureOrderRequest = {
  cart: Cart
  totalPrice: Price
  paypalId: string
}
