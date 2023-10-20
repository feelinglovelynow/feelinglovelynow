import type { Price } from '$lib/store/Price'
import type { Cart } from '$lib/dgraph/dgraph.d'


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

export type AddOrderCart = {
  id: string
  size?: string
  quantity: number
  Product: {
    id: string
  }
}
