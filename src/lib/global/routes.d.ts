export type SearchResponse = {
  quotes?: Source[]
  sourcesByTitle?: Source[]
  sourcesByDescription?: Source[]
}

export type SearchOrdersRequest = {
  uid?: string
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
