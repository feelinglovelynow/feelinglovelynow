import { ace, td } from '@ace/db'
import { json } from '@sveltejs/kit'
import Price from '$lib/store/Price'
import apiPaypal from '$lib/store/apiPaypal'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import { one } from '@feelinglovelynow/svelte-catch'
import { enumOrderItemStatus } from '$lib/global/enums'
import type { CaptureOrderRequest, PrettyPaypal } from '$lib'
import { validateRequestCart } from '$lib/store/validateRequestCart'
import { ACE_CRYPT_JWK, ACE_CRYPT_IV, ACE_DIRECTORY, ACE_ENVIRONMENT } from '$env/static/private'


export const POST = (async ({ request }) => {
  try {
    const body = await request.json() as CaptureOrderRequest

    if (!body?.paypalId) throw one('Please add a paypalId to the request', { body })
    else {
      await validateRequestCart(body.cart, body.totalPrice) // validate the cart and totalPrice in request is valid
      const rPaypal = await captureOrder(body.paypalId) // send paypal the paypalId and process the payment for this order

      if (rPaypal?.status !== 'COMPLETED') throw one('The payment was not successful', { rPaypal: JSON.stringify(rPaypal) })
      else {
        const pretty = getPrettyPaypalResponse(rPaypal) // get necessary info from the paypal payment response
        await graphAddOrder(body, pretty) // add the order to graph
        return json({ success: true }) // no one threw so we are good
      }
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler


async function captureOrder (paypalId: string) {
  const { response } = await apiPaypal(`v2/checkout/orders/${ paypalId }/capture`)
  return response
}


function getPrettyPaypalResponse (response: any): PrettyPaypal {
  return {
    email: response?.payment_source?.paypal.email_address || '',
    name: response?.purchase_units?.[0].shipping?.name?.full_name || '',
    addressLine1: response?.purchase_units?.[0].shipping?.address?.address_line_1 || '',
    addressLine2: response?.purchase_units?.[0].shipping?.address.address_line_2 || '',
    city: response?.purchase_units?.[0].shipping?.address?.admin_area_2 || '',
    state: response?.purchase_units?.[0].shipping?.address?.admin_area_1 || '',
    zip: response?.purchase_units?.[0].shipping?.address?.postal_code || '',
    country: response?.purchase_units?.[0].shipping?.address?.country_code || '',
    totalPrice: new Price(response?.purchase_units?.[0].payments?.captures?.[0].amount?.value),
    paypalFee: new Price(response?.purchase_units?.[0].payments?.captures?.[0].seller_receivable_breakdown?.paypal_fee.value),
  }
}


async function graphAddOrder (body: CaptureOrderRequest, pretty: PrettyPaypal) {
  const req: td.AceFnRequest = []

  req.push({
    do: 'NodeInsert',
    how: {
      $o: { cryptJWK: 'crypt', iv: 'crypt' },
      node: 'Order',
      props: {
        id: '_:order',
        paypalId: body.paypalId,
        email: pretty.email,
        name: pretty.name,
        addressLine1: pretty.addressLine1,
        addressLine2: pretty.addressLine2,
        city: pretty.city,
        zip: pretty.zip,
        country: pretty.country,
        paypalFee: pretty.paypalFee.num,
        totalPrice: pretty.paypalFee.totalPrice,
      }
    }
  })
  
  for (let i = 0; i < body.cart.length; i++) {
    if (body.cart[i].product) {
      req.push({ do: 'NodeInsert', how: { node: 'OrderItem', props: { id: '_:oi' + i, quantity: body.cart[i].quantity, size: body.cart[i].size, status: enumOrderItemStatus.PURCHASED } } })
      req.push({ do: 'RelationshipInsert', how: { relationship: 'orderItemProduct', props: { a: '_:oi' + i, b: body.cart[i].product.id  } } })
      req.push({ do: 'RelationshipInsert', how: { relationship: 'orderOrderItems', props: { a: '_:order', b: '_:oi' + i } } })
    }
  }

  await ace({
    req,
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    ivs: { crypt: ACE_CRYPT_IV },
    jwks: { crypt: { type: 'crypt', jwk: ACE_CRYPT_JWK } },
  })
}
