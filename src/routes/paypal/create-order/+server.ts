import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { apiPaypal } from '$lib/store/apiPaypal'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import { twoDecimalPlaces } from '$lib/store/twoDecimalPlaces'
import { validateRequestCart } from '$lib/store/validateRequestCart'
import type { CreateOrderRequest, ExpandedSubTotal, Cart } from '$lib'


export const POST = (async ({ request, platform }) => {
  try {
    const body = await request.json() as CreateOrderRequest
    const response = await validateRequestCart(body.cart, body.totalPrice, platform)

    if (response._errors.length) return json({ errors: response._errors }, { status: 400 })
    else if (!response.expandedSubTotal) return json({ _errors: [ 'An unknown error occured' ] }, { status: 400 }) // allow us to be in the else below knowing we have a response (even though if we don't errors above we'll run, but ts doesen't know that so...)
    else return await createPaypalOrder(body.cart, response.expandedSubTotal)
  } catch (e) {
    return serverRequestCatch(e)
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
        sku: cartItem.product?.id,
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
  return json(response, { status })
}
