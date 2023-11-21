import { json } from '@sveltejs/kit'
import apiPaypal from '$lib/store/apiPaypal'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import { twoDecimalPlaces } from '$lib/store/twoDecimalPlaces'
import { validateRequestCart } from '$lib/store/validateRequestCart'
import type { CreateOrderRequest, ExpandedSubTotal, Cart } from '$lib'


export const POST = (async ({ request, platform }) => {
  try {
    const body = await request.json() as CreateOrderRequest
    const expandedSubTotal = await validateRequestCart(body.cart, body.totalPrice, platform)
    return await createPaypalOrder(body.cart, expandedSubTotal)
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler


async function createPaypalOrder (cart: Cart, expandedSubTotal: ExpandedSubTotal) {
  const purchase_units = [
    {
      reference_id: crypto.randomUUID(),
      description: 'Feeling Lovely Now ⋅ Online Store Purchase',
      amount: {
        currency_code: 'USD',
        value: expandedSubTotal.totalPrice.str,
        breakdown: {
          item_total: {
            value: expandedSubTotal.subTotal.str,
            currency_code: 'USD',
          },
          shipping: {
            value: expandedSubTotal.shipping.str,
            currency_code: 'USD',
          },
          tax_total: {
            value: expandedSubTotal.salesTax.str,
            currency_code: 'USD',
          }
        }
      },
      items: cart.map(cartItem => ({
        sku: cartItem.product?.uid,
        quantity: cartItem.quantity,
        name: cartItem.size ?
          `Size: ${cartItem.size} ⋅ ${ cartItem.product?.name }` :
          cartItem.product?.name,
        unit_amount: {
          currency_code: 'USD',
          value: twoDecimalPlaces(cartItem.product?.price)
        }
      }))
    }
  ]

  const payment_source = {
    paypal: {
      experience_context: {
        locale: 'en-US',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        brand_name: 'Feeling Lovely Now',
        payment_method_selected: 'PAYPAL',
        shipping_preference: 'GET_FROM_FILE',
        payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
      }
    }
  }

  const { response, status } = await apiPaypal('v2/checkout/orders', { intent: 'CAPTURE', purchase_units, payment_source })
  return json({ id: response.id }, { status })
}
