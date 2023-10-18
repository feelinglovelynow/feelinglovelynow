import get from '$lib/kv/get'
import { json } from '@sveltejs/kit'
import Price from '$lib/store/Price'
import apiPaypal from '$lib/store/apiPaypal'
import type { RequestHandler } from './$types'
import { PUBLIC_HOST } from '$env/static/public'
import expandSubTotal from '$lib/store/expandSubTotal'
import type { CreateOrderRequest, Product, Cart } from '$lib'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import { twoDecimalPlaces } from '$lib/store/twoDecimalPlaces'


export const POST = (async ({ request, platform }) => {
  try {
    const body = await request.json() as CreateOrderRequest
    const _errors = validateFields(body)
    const subTotal = await mergeCartWithProducts(body, _errors, platform)
    const response = getTotalPrice(_errors, subTotal, body)

    if (_errors.length) return json({ _errors }, { status: 400 })
    else if (!response) return json({ _errors: [ 'An unknown error occured' ] }, { status: 400 }) // allow us to be in the else below knowing we have a response (even though if we don't errors above we'll run, but ts doesen't know that so...)
    else return await createPaypalOrder(body.cart, subTotal, response.shipping, response.salesTax, response.totalPrice)
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler


function validateFields (body: CreateOrderRequest) {
  const errors: string[] = []

  if (!body.totalPrice.num || !body.totalPrice.str) errors.push('Please add a price')
  if (!body.cart.length) errors.push('Please add items to your cart')

  return errors
}


async function mergeCartWithProducts (body: CreateOrderRequest, errors: string[], platform: Readonly<App.Platform> | undefined) {
  const cartSubTotal = new Price()

  if (!errors.length) {
    const kvProducts = await get('MAIN_CACHE', 'products', platform) as Product[]

    for (const cartItem of body.cart) { // give each product in the cart a product object (so we know it's price)
      for (const product of kvProducts) {
        if (!cartItem.productId) break
        else if (cartItem.productId === product.id) {
          cartItem.product = product
          break
        }
      }
    }

    for (const cartItem of body.cart) {
      if (!cartItem.productId) errors.push('All items in cart need a productId')
      else if (!cartItem.product) errors.push(`Product id: "${ cartItem.productId }", that is in your cart, is not a valid product id`)
      else if (!cartItem.quantity || !Number.isInteger(cartItem.quantity)) {
        if (cartItem?.product?.name) errors.push(`Product name: "${ cartItem.product.name }" needs a quantity to proceed`)
        else if (cartItem.productId) errors.push(`Product id: "${ cartItem.productId }" needs a quantity to proceed`)
        else errors.push('All items in cart need a quantity')
      } else {
        cartItem.subTotal = new Price(cartItem.product.price * cartItem.quantity) // sets the num and the str
        cartSubTotal.add(cartItem.subTotal.num) // add cart items subTotal to the cart's subTotal AND updates the str
      }
    }
  }

  return cartSubTotal
}


function getTotalPrice (errors: string[], subTotal: Price, body: CreateOrderRequest) {
  if (errors.length) return null
  else {
    const { totalPrice, salesTax, shipping } = expandSubTotal(subTotal.num)

    if (!totalPrice.num) errors.push('Provided cart does not have a total price')
    if (totalPrice.str !== body.totalPrice.str) errors.push('Total price in request is wrong')

    return errors.length ? null :
      {
        shipping,
        salesTax,
        totalPrice,
      }
  }
}


async function createPaypalOrder (cart: Cart, subTotal: Price, shipping: Price, salesTax: Price, totalPrice: Price) {
  const purchase_units = [
    {
      reference_id: crypto.randomUUID(),
      description: 'Feeling Lovely Now - Online Store Purchase',
      amount: {
        currency_code: 'USD',
        value: totalPrice.str,
        breakdown: {
          item_total: {
            value: subTotal.str,
            currency_code: 'USD',
          },
          shipping: {
            value: shipping.str,
            currency_code: 'USD',
          },
          tax_total: {
            value: salesTax.str,
            currency_code: 'USD',
          }
        }
      },
      items: cart.map(cartItem => ({
        sku: cartItem.product?.id,
        quantity: cartItem.quantity,
        name: cartItem.size ?
          `(Size: ${cartItem.size}) - ${ cartItem.product?.name }` :
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

  return apiPaypal('v2/checkout/orders', { intent: 'CAPTURE', purchase_units, payment_source })
}
