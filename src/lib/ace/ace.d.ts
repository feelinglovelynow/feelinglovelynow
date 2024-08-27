import { td } from '@ace/db'


export interface Image extends Omit<td.Image, 'product'> {
  src?: 'webp' | 'png'
  product?: Product
}

export interface Product extends Omit<td.Product, 'image'> {
  image?: Image
}

export interface OrderItem extends Omit<td.OrderItem, 'product'> {
  product?: Product
}

export interface Order extends Omit<td.Order, 'items'> {
  items?: OrderItem[]
  showOrderDetails?: boolean
  trOrderDetails?: HTMLTableRowElement
}

export interface User extends Omit<td.User, 'session'> {
  session?: Session
}

export interface Session extends Omit<td.Session, 'user'> {
  user?: User
}
