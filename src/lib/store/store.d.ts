export type Cart = OrderItem[]


export type ExpandedSubTotal = {
  subTotal: Price
  salesTax: Price
  shipping: Price
  totalPrice: Price
}

export type AddOrderRequestOrderItems = {
  quantity: number
  size?: enumOrderItemSize
  product: AddByUid
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


export type ReturnRequestSome = {
  bodyOrderItem: OrderItem,
  dgraphOrderItem: OrderItem
}

export type PublicPaypalCredentials = {
  clientId: string
}

export type PrivatePaypalCredentials = {
  apiUrl: string,
  clientSecret: string,
}
