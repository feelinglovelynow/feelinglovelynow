export type Source = {
  id: string
  slug: string
  description?: string
  type?: enumSourceType
  title: string
  authors: Author[]
  quotes: Quote[]
  categories?: Category[]
  url: string
  urlType: enumSourceUrlType
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
  extension: enumImageExtension
}

export type Product = {
  id: string
  slug: string
  printfulId?: string
  price: number
  name: string
  description: enumProductDescription
  primaryImage: Image
  featuredDisplayOrder: int
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
  transaction: Transaction
  paypalFee: number
  showOrderDetails?: boolean
  trOrderDetails?: HTMLTableRowElement
}

export type OrderItem = {
  id: string
  productId?: string
  quantity: number
  size?: enumOrderItemSize
  product?: Product
  subTotal?: Price
  order?: Order,
  status?: enumOrderItemStatus
  shippingCarrier?: enumShippingCarrier
  shippingTrackingId?: string
}

export type User = {
  id: string
  email?: string
  firstName?: string
  sessions?: Session[]
}

export type Session = {
  id: string
  user: User
  ipAddress: string
  accessExpiration: string
  refreshExpiration: string
}
