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
  size?: OrderItemSizes
  product: AddOrderProduct
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
  status: string
  totalPrice: Price
  paypalFee: Price
}
