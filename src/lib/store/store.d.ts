import type { Product } from '$lib/dgraph/dgraph'

export type CartItem = {
  id: string
  productId?: string
  quantity: number
  size?: CartItemSizes
  product?: Product
  subTotal?: Price
}

export type Cart = CartItem[]
export type CartItemSizes = 'S' | 'M' | 'L' | 'XL'

export type CartRequest = {
  name: string
  email: string
  address: string
  zip: string
  country: string
  nonce: string
  totalPrice: Price
  cart: Cart
}

export type CreateOrderRequest = {
  cart: Cart
  totalPrice: Price
}

export type CaptureOrderRequest = {
  orderId: string
}

export type ReversalTransaction = {
  id: string
  status: string
}
