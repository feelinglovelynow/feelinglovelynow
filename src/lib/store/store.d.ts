import type { Price } from '$lib/store/Price'
import type { Cart } from '$lib/dgraph/dgraph.d'


export type Cart = OrderItem[]


export type CreateOrderRequest = {
  cart: Cart
  totalPrice: Price
}

export type CaptureOrderRequest = {
  cart: Cart
  totalPrice: Price
  orderId: string
}


export type ExpandedSubTotal = {
  subTotal: Price
  salesTax: Price
  shipping: Price
  totalPrice: Price
}

export type AddOrderRequestOrderItems = {
  id: string
  quantity: number
  size?: enumOrderItemSize
  product: AddOrderProduct
  status: enumOrderItemStatus
}[]

export type PrettyPaypal = {
  email: string
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zip: string
  country: string
  totalPrice: Price
  paypalFee: Price
}

export type SearchOrdersRequest = {
  orderId?: string
  email?: string
  startDate?: string
  endDate?: string
}


export type ReturnRequestSome = {
  bodyOrderItem: OrderItem,
  dgraphOrderItem: OrderItem
}[]
