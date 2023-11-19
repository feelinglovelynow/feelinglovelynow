export type Source = {
  uid: string
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
  uid?: string
  slug: string
  name: string
  lowName?: string
  href?: string
}

export type Quote = {
  uid?: string
  text: string
  displayOrder: number
  categories: Category[]
}

export type Category = {
  uid?: string
  slug: string
  name: string
  lowName?: string
  href?: string
}

export type Image = {
  uid: string
  src?: string
  displayOrder?: int
  extension: enumImageExtension
}

export type Product = {
  uid: string
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

export type Order = {
  uid: string
  paypalId: string
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
  uid: string
  productUid?: string
  quantity: number
  size?: enumOrderItemSize
  product?: Product
  subTotal?: Price
  order?: Order,
  status?: enumOrderItemStatus
  shippingCarrier?: enumShippingCarrier
  shippingTrackingId?: string
  refundAmount?: number
}

export type User = {
  uid: string
  email: string
  firstName: string
  sessions: Session[]
}

export type Session = {
  uid: string
  user: User
  ipAddress: string
  accessExpiration: string
  refreshExpiration: string
}

export interface AddSession extends Session {
  uid?: never
  user: AddByUid
  ipAddress: string
  accessExpiration: string
  refreshExpiration: string
}

export type AddByUid = {
  uid: string
}
