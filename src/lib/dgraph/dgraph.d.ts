export type SourceType = 'science' | 'culture' | 'product' | undefined


export type Source = {
  id: string
  slug: string
  description?: string
  type: SourceType
  title: string
  authors: Author[]
  quotes: Quote[]
  categories?: Category[]
  url: string
  urlType: 'academia' | 'pubmed' | 'youtube' | 'pdf' | 'heartmath' | 'scribd' | 'soundcloud' | 'internet'
  publicationLocation: string
  publicationYear: number
  images?: Image[]
}

export type Author = {
  id?: string
  slug: string
  name: string
  lowName?: string
  href?: string
}

export type Quote = {
  id?: string
  text: string
  displayOrder: number
  categories: Category[]
}

export type Category = {
  id?: string
  slug: string
  name: string
  lowName?: string
  href?: string
}

export type Image = {
  id: string
  src?: string
  displayOrder?: int
  extension: 'png' | 'webp'
}

export type Product = {
  id: string
  slug: string
  printfulId?: string
  price: number
  name: string
  description?: string
  primaryImage: Image
  homeDisplayOrder: int
  storeDisplayOrder: int
  showFlowerMetatronMerkaba: boolean
  categories: Category[]
  similarProducts: Product[]
}

export type AddOrderProduct = {
  id: string
}

export type Order = {
  id: string
  name: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zip: string
  country: string
  totalPrice: number
  orderItems: OrderItem[]
  createdAt: string
  status: OrderStatus
  transaction: Transaction
  paypalFee: number
  isOpen?: boolean
}

export type OrderItem = {
  id: string
  productId?: string
  quantity: number
  size?: OrderItemSizes
  product?: Product
  subTotal?: Price
  order?: Order
}

export enum OrderStatus {
  COMPLETED,
  DECLINED,
  PARTIALLY_REFUNDED,
  PENDING,
  REFUNDED,
  FAILED,
}

export type OrderItemSizes = 'S' | 'M' | 'L' | 'XL'
