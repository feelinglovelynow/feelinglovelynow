export type Cart = OrderItem[]


export type ExpandedSubTotal = {
  subTotal: Price
  salesTax: Price
  shipping: Price
  totalPrice: Price
}

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
  graphOrderItem: OrderItem
}

export type PublicPaypalCredentials = {
  clientId: string
}

export type PrivatePaypalCredentials = {
  apiUrl: string,
  clientSecret: string,
}
