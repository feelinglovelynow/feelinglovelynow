import { json } from '@sveltejs/kit'
import type Price from '$lib/store/Price'
import send from '$lib/mailchannels/send'
import addOrder from '$lib/dgraph/addOrder'
import type { RequestHandler } from './$types'
import { apiPaypal } from '$lib/store/apiPaypal'
import IMG_LOTUS from '$lib/svg/sacred/lotus/image.png'
import IMG_FLOWER from '$lib/svg/sacred/flower/image.png'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import IMG_METATRON from '$lib/svg/sacred/fruit_metatron/image.png'
import { validateRequestCart } from '$lib/store/validateRequestCart'
import type { CaptureOrderRequest, Cart, CartItem, AddOrderCart } from '$lib'


export const POST = (async ({ request, platform }) => {
  try {
    const body = await request.json() as CaptureOrderRequest

    if (!body?.orderId) return json({ _errors: [ 'Please add an orderId to the request' ] }, { status: 400 })
    else {
      const response = await validateRequestCart(body.cart, body.totalPrice, platform) // validate the cart and totalPrice in request is valid

      if (response._errors.length) return json({ errors: response._errors }, { status: 400 })
      else if (!response.expandedSubTotal) return json({ _errors: [ 'An unknown error occured' ] }, { status: 400 }) // allow us to be in the else below knowing we have a response (even though if we don't errors above we'll run, but ts doesen't know that so...)
      else {
        const rPaypal = await captureOrder(response._errors, body.orderId) // send paypal the order id and process the payment for this order id

        if (response._errors.length) return json({ errors: response._errors }, { status: 400 })
        else {
          const pretty = getPrettyPaypalResponse(rPaypal) // get necessary info from the paypal payment response

          await Promise.all([ // add the order to our database and send emails to us and the customer
            dgraphAddOrder(body.orderId, body.cart, pretty.email, pretty.name, pretty.addressLine1, pretty.addressLine2, pretty.city, pretty.state, pretty.zip, pretty.country, body.totalPrice.num, pretty.status, pretty.paypalFee),
            sendEmails(body.orderId, body.cart, body.totalPrice, pretty.email, pretty.name, pretty.addressLine1, pretty.addressLine2, pretty.city, pretty.state, pretty.country, pretty.zip, response.expandedSubTotal.subTotal, response.expandedSubTotal.shipping, response.expandedSubTotal.salesTax),
          ])

          return json({ success: true })
        }
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler


async function captureOrder (_errors: string[], orderId: string) {
  const { response } = await apiPaypal(`v2/checkout/orders/${ orderId }/capture`)
  return response
}


function getPrettyPaypalResponse (response: any) {  
  return {
    email: response.payment_source.paypal.email_address || '',
    name: response.purchase_units[0].shipping.name.full_name || '',
    addressLine1: response.purchase_units[0].shipping.address.address_line_1 || '',
    addressLine2: response.purchase_units[0].shipping.address.address_line_2 || '',
    city: response.purchase_units[0].shipping.address.admin_area_2 || '',
    state: response.purchase_units[0].shipping.address.admin_area_1 || '',
    zip: response.purchase_units[0].shipping.address.postal_code || '',
    country: response.purchase_units[0].shipping.address.country_code || '',
    totalPrice: Number(response.purchase_units[0].payments.captures[0].amount.value) || 0,
    status: response.status || '',
    paypalFee: Number(response.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value) || 0,
  }
}


async function dgraphAddOrder (orderId: string, cart: Cart, email: string, name: string, addressLine1: string, addressLine2: string, city: string, state: string, zip: string, country: string, totalPrice: number, status: string, paypalFee: number) {
  const addOrderCart: AddOrderCart[] = []

  for (const cartItem of cart) {
    if (cartItem.product) {
      addOrderCart.push({
        id: cartItem.id,
        size: cartItem.size ? cartItem.size : undefined,
        quantity: cartItem.quantity,
        Product: { id: cartItem.product.id },
      })
    }
  }

  await addOrder(orderId, email, name, addressLine1, addressLine2, city, state, zip, country, totalPrice, addOrderCart, status, paypalFee)
}


async function sendEmails (orderId: string, cart: Cart, totalPrice: Price, email: string, name: string, addressLine1: string, addressLine2: string, city: string, state: string, country: string, zip: string, subTotal: Price, shipping: Price, salesTax: Price) {
  let orderItemsHtml = ''

  for (const orderItem of cart) {
    orderItemsHtml += await getOrderItemHtml(orderItem)
  }

  const header = {
    customer: `
      <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">🙏 Thanks ${ name }!</div>
      <div style="color: #273142; margin-bottom: 12px; padding-bottom: 15px; line-height: 1.45; border-bottom: 1px solid rgba(206, 211, 214, 0.6);">Please feel free to reply to this email if you would love to contact us about your order! The day we ship your items, is the day we will email you the shipping tracking information!</div>
    `,
    us: `
      <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">🙏 Customer Details</div>
      <div style="margin-bottom: 12px; padding-bottom: 15px; line-height: 1.45; border-bottom: 1px solid rgba(206, 211, 214, 0.6);">
        <div style="color: #273142;">Name: ${ name }</div>
        <div style="color: #273142;">Email: ${ email }</div>
      </div>
    `
  }


  function getContent (key: 'us' | 'customer') {
    return `
      <div style="padding: 18px 18px 27px 18px; font-size: 16px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif;">
        <div style="max-width: 444px; width: 100%; margin: 0 auto;">

          ${ header[key] }

          <table style="margin-bottom: 15px; padding-bottom: 12px; width: 100%; border-bottom: 1px solid rgba(206, 211, 214, 0.6);">
            <tr>
              <td>
                <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Order ID</div>
                <div style="color: #273142; line-height: 1.45;">${ orderId }</div>
              </td>
              <td style="text-align: right; padding-left: 9px;">
                <img style="width: 100%; max-width: 99px;" src="https://feelinglovelynow.com${ IMG_FLOWER }" />
              </td>
            <tr>
          </table>

          <table style="margin-bottom: 18px; width: 100%; border-bottom: 1px solid rgba(206, 211, 214, 0.6); padding-bottom: 12px;">
            <tr>
              <td>
                <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Shipping Address</div>
                <div style="color: #273142; line-height: 1.45;">
                  <div>${ name }</div>
                  <div>${ addressLine1 } ${ addressLine2 || '' }</div>
                  <div>${ city }, ${ state }, ${ country } ${ zip }</div>
                </div>
              </td>
              <td style="text-align: right; padding-left: 9px;">
                <img style="width: 100%; max-width: 99px;" src="https://feelinglovelynow.com${ IMG_METATRON }" />
              </td>
            </tr>
          </table>

          <table style="margin-bottom: 18px; width: 100%; border-bottom: 1px solid rgba(206, 211, 214, 0.6); padding-bottom: 12px;">
            <tr>
              <td>
                <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Pricing Details</div>
                <div style="color: #273142; line-height: 1.45;">
                  <div>Sub Total: $${ subTotal.str }</div>
                  <div>Shipping: $${ shipping.str }</div>
                  <div>Sales Tax: $${ salesTax.str }</div>
                  <div style="font-weight: 500;">Total: $${ totalPrice.str } USD</div>
                </div>
              </td>
              <td style="text-align: right; padding-left: 9px;">
                <img style="width: 100%; max-width: 114px;" src="https://feelinglovelynow.com${ IMG_LOTUS }" />
              </td>
            </tr>
          </table>

          <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Purchased Products</div>
          ${ orderItemsHtml }
          <div style="color: #273142; width: 100%; text-align: right;">- Hakuna Matata</div>
        </div>
      </div>
    `
  }


  const options = {
    customer: { subject: `🙏 Thanks ${ name } for shopping with Feeling Lovely Now!`, to: email, content: getContent('customer') },
    us: { subject: `🙌 $${ totalPrice.str } store puchase by ${ name }`, to: 'us@feelinglovelynow.com', content: getContent('us') }
  }

  if (email.includes('example.com')) await send(options.us) // paypal in sandbox mode has the customer email as example.com and there is no need to send this user an email
  else await Promise.all([ send(options.us), send(options.customer) ]) // send us and the cutomer an email
}


async function getOrderItemHtml (cartItem: CartItem) {
  return `
    <table style="width: 100%; margin-bottom: 15px;">
      <tr>
        <td style="width: 126px; height: 126px; text-align: center; vertical-align: top;">
          <img style="height: 100%; max-height: 126px;" src="https://feelinglovelynow.com${ (await import(`../../../lib/img/store/${ cartItem.product?.primaryImage.id }.${ cartItem.product?.primaryImage.extension }`)).default }" alt="${ cartItem.product?.name }">
        </td>
      <td style="color: #273142;padding: 3px 0 0 9px; vertical-align: top;">
        <div style="color: #273142; font-weight: 600; margin-bottom: 3px;">${ cartItem.product?.name }</div>
        <div style="color: #273142; margin-bottom: 3px;">Quantity: ${ cartItem.quantity }</div>
        ${ cartItem.size ? '<div style="color: #273142;">Size: ' + cartItem.size + '</div>' : '' }
      </td>
      </tr>
    </table>
  `
}
