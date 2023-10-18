import Price from '$lib/store/Price'
import { shippingCost, salesTaxPercentage } from '$lib/store/constants'


export default function expandSubTotal (subTotalNum: number) {
  const subTotal = new Price(subTotalNum)
  const shipping = new Price(shippingCost)
  const salesTax = new Price((subTotal.num + shipping.num) * salesTaxPercentage)
  const totalPrice = new Price(subTotal.num + shipping.num + salesTax.num)

  return { subTotal, salesTax, shipping, totalPrice }
}
