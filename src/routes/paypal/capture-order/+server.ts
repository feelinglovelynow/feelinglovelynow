import { json } from '@sveltejs/kit'
import Price from '$lib/store/Price'
import send from '$lib/mailchannels/send'
import addOrder from '$lib/dgraph/addOrder'
import type { RequestHandler } from './$types'
import { apiPaypal } from '$lib/store/apiPaypal'
import IMG_LOTUS from '$lib/sacred/IMG_LOTUS.png'
import IMG_MERKABA from '$lib/sacred/IMG_MERKABA.png'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import IMG_EMAIL_HEAD from '$lib/img/email/IMG_EMAIL_HEAD.png'
import IMG_FRUIT_METATRON from '$lib/sacred/IMG_FRUIT_METATRON.png'
import { validateRequestCart } from '$lib/store/validateRequestCart'
import type { CaptureOrderRequest, ExpandedSubTotal, OrderItem, AddOrderRequestOrderItems, PrettyPaypal } from '$lib'


export const POST = (async ({ request, platform }) => {
  try {
    const body = await request.json() as CaptureOrderRequest

    if (!body?.orderId) return json({ _errors: [ 'Please add an orderId to the request' ] }, { status: 400 })
    else {
      const response = await validateRequestCart(body.cart, body.totalPrice, platform) // validate the cart and totalPrice in request is valid

      if (response._errors.length) return json({ errors: response._errors }, { status: 400 })
      else if (!response.expandedSubTotal) return json({ _errors: [ 'An unknown error occured' ] }, { status: 400 }) // allow us to be in the else below knowing we have a response (even though if we don't errors above we'll run, but ts doesen't know that so...)
      else {
        const rPaypal = await captureOrder(response._errors, body.orderId) // send paypal the orderId and process the payment for this orderId

        if (response._errors.length) return json({ errors: response._errors }, { status: 400 })
        else {
          const pretty = getPrettyPaypalResponse(rPaypal) // get necessary info from the paypal payment response

          await Promise.all([ // add the order to our database and send emails to us and the customer
            dgraphAddOrder(body, pretty),
            sendEmails(body, pretty, response.expandedSubTotal)
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


function getPrettyPaypalResponse (response: any): PrettyPaypal {  
  return {
    status: response?.status || '',
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


function dgraphAddOrder (body: CaptureOrderRequest, pretty: PrettyPaypal) {
  const orderItems: AddOrderRequestOrderItems = []

  for (const cartItem of body.cart) {
    if (cartItem.product) {
      orderItems.push({
        id: cartItem.id,
        quantity: cartItem.quantity,
        size: cartItem.size ? cartItem.size : undefined,
        product: { id: cartItem.product.id },
      })
    }
  }

  return addOrder(body.orderId, orderItems, pretty)
}


async function sendEmails (body: CaptureOrderRequest, pretty: PrettyPaypal, expandedSubTotal: ExpandedSubTotal) {
  let orderItemsHtml = ''

  for (const orderItem of body.cart) {
    orderItemsHtml += await getOrderItemHtml(orderItem)
  }

  const header = {
    customer: `
      <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">🙏 Thanks ${ pretty.name }!</div>
      <div style="color: #273142; text-align: justify; margin-bottom: 12px; padding-bottom: 15px; line-height: 1.45; border-bottom: 1px solid rgba(206, 211, 214, 0.6);">Please feel free to reply to this email if you would love to contact us about your order! We will email you order status information and shipping tracking information soon!</div>
    `,
    us: `
      <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">🙏 Purchase Details</div>
      <div style="margin-bottom: 12px; padding-bottom: 15px; line-height: 1.45; border-bottom: 1px solid rgba(206, 211, 214, 0.6);">
        <div style="color: #273142;">Paypal Fee: $${ pretty.paypalFee.str }</div>
        <div style="color: #273142;">Name: ${ pretty.name }</div>
        <div style="color: #273142;">Email: ${ pretty.email }</div>
      </div>
    `
  }


  function getContent (key: 'us' | 'customer') {
    return `
      <div style="padding: 18px 18px 27px 18px; font-size: 16px; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif;">
        <div style="max-width: 444px; width: 100%; margin: 0 auto;">

          <div style="height: 90px; width: 100%; text-align: center;">
            <img style="width: 280px; padding-right: 9px;" src="https://feelinglovelynow.com${ IMG_EMAIL_HEAD }" alt="logo" />
          </div>

          ${ header[key] }

          <table style="margin-bottom: 15px; padding-bottom: 12px; width: 100%; border-bottom: 1px solid rgba(206, 211, 214, 0.6);">
            <tr>
              <td>
                <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Order ID</div>
                <div style="color: #273142; line-height: 1.45;">${ body.orderId }</div>
              </td>
              <td style="text-align: right; padding-left: 9px;">
                <img style="width: 100%; max-width: 99px;" src="https://feelinglovelynow.com${ IMG_FRUIT_METATRON }" />
              </td>
            <tr>
          </table>

          <table style="margin-bottom: 18px; width: 100%; border-bottom: 1px solid rgba(206, 211, 214, 0.6); padding-bottom: 12px;">
            <tr>
              <td>
                <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Shipping Address</div>
                <div style="line-height: 1.45;">
                  <div style="color: #273142;">${ pretty.name }</div>
                  <div style="color: #273142;">${ pretty.addressLine1 } ${ pretty.addressLine2 || '' }</div>
                  <div style="color: #273142;">${ pretty.city }, ${ pretty.state }, ${ pretty.country } ${ pretty.zip }</div>
                </div>
              </td>
              <td style="text-align: right; padding-left: 9px;">
                <img style="width: 100%; max-width: 99px;" src="https://feelinglovelynow.com${ IMG_MERKABA }" />
              </td>
            </tr>
          </table>

          <table style="margin-bottom: 18px; width: 100%; border-bottom: 1px solid rgba(206, 211, 214, 0.6); padding-bottom: 12px;">
            <tr>
              <td>
                <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Pricing Details</div>
                <div style="line-height: 1.45;">
                  <div style="color: #273142;">Sub Total: $${ expandedSubTotal.subTotal.str }</div>
                  <div style="color: #273142;">Shipping: $${ expandedSubTotal.shipping.str }</div>
                  <div style="color: #273142;">Sales Tax: $${ expandedSubTotal.salesTax.str }</div>
                  <div style="color: #273142; font-weight: 500;">Total: $${ expandedSubTotal.totalPrice.str } USD</div>
                </div>
              </td>
              <td style="text-align: right; padding-left: 9px;">
                <img style="width: 100%; max-width: 99px;" src="https://feelinglovelynow.com${ IMG_LOTUS }" />
              </td>
            </tr>
          </table>

          <div style="color: #273142; font-weight: 600; font-size: 18px; margin-bottom: 3px;">Purchased Products</div>
          ${ orderItemsHtml }
          <div style="color: #273142; width: 100%; text-align: right;">- Hakuna Matata</div>
          <div style="display: none;">${ crypto.randomUUID() }</div>
        </div>
      </div>
    `
  }


  const options = {
    customer: { subject: `🙏 Thanks ${ pretty.name } for shopping with Feeling Lovely Now!`, to: pretty.email, content: getContent('customer') },
    us: { subject: `🙌 $${ expandedSubTotal.totalPrice.str } store puchase by ${ pretty.name }`, to: 'us@feelinglovelynow.com', content: getContent('us') }
  }

  if (pretty.email.includes('example.com')) return send(options.us) // paypal in sandbox mode has the customer email as example.com and there is no need to send this user an email
  else return Promise.all([ send(options.us), send(options.customer) ]) // send us and the cutomer an email
}


async function getOrderItemHtml (orderItem: OrderItem) {
  return `
    <table style="width: 100%; margin-bottom: 15px;">
      <tr>
        <td style="width: 126px; height: 126px; text-align: center; vertical-align: top;">
          <img style="height: 100%; max-height: 126px;" src="https://feelinglovelynow.com${ (await import(`../../../lib/img/store/${ orderItem.product?.primaryImage.id }.${ orderItem.product?.primaryImage.extension }`)).default }" alt="${ orderItem.product?.name }">
        </td>
      <td style="color: #273142;padding: 3px 0 0 9px; vertical-align: top;">
        <div style="color: #273142; font-weight: 600; margin-bottom: 3px;">${ orderItem.product?.name }</div>
        <div style="color: #273142; margin-bottom: 3px;">Quantity: ${ orderItem.quantity }</div>
        ${ orderItem.size ? '<div style="color: #273142;">Size: ' + orderItem.size + '</div>' : '' }
      </td>
      </tr>
    </table>
  `
}
