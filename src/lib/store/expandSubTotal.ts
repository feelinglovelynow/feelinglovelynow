import type { Price } from '$lib'
import { twoDecimalPlaces } from '$lib/store/twoDecimalPlaces'


export default function expandSubTotal (subTotal: Price) {
  const salesTaxPercentage = 0.09

  const shipping: Price = { str: '', num: 6 }
  const salesTax: Price = { str: '', num: 0 }
  const totalPrice: Price = { str: '', num: 0 }

  shipping.str = twoDecimalPlaces(shipping.num)
  subTotal.str = twoDecimalPlaces(subTotal.num)

  salesTax.num = subTotal.num * salesTaxPercentage
  salesTax.str = twoDecimalPlaces(salesTax.num)

  totalPrice.num = salesTax.num + subTotal.num + shipping.num
  totalPrice.str = twoDecimalPlaces(totalPrice.num)

  return { subTotal, salesTax, shipping, totalPrice }
}
