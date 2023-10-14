import type { Product } from '$lib/dgraph/dgraph'

export type CartItem = {
  productId?: string
  quantity: number
  size?: CartItemSizes
  product?: Product
}

export type Cart = CartItem[]
export type CartItemSizes = 'S' | 'M' | 'L' | 'XL'

export type Price = {
  str: string
  num: number
}
