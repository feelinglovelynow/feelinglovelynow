import type { Product } from '$lib/dgraph/dgraph'

export type CartItem = {
  id: string
  productId?: string
  quantity: number
  size?: CartItemSizes
  product?: Product
  price?: number
}

export type Cart = CartItem[]
export type CartItemSizes = 'S' | 'M' | 'L' | 'XL'

export type Price = {
  str: string
  num: number
}

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

export type ReversalTransaction = {
  id: string
  status: string
}
