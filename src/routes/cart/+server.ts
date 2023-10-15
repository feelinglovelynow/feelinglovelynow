import get from '$lib/kv/get'
import type { CartItem } from '$lib'
import { json } from '@sveltejs/kit'
import send from '$lib/mailchannels/send'
import addOrder from '$lib/dgraph/addOrder'
import type { CartRequest, Price } from '$lib'
import type { RequestHandler } from './$types'
import expandSubTotal from '$lib/store/expandSubTotal'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import { createTransaction } from '$lib/braintree/createTransaction'
import { reverseTransaction } from '$lib/braintree/reverseTransaction'


export const POST = (async ({ request, platform }) => {
  try {
    const body = await request.json() as CartRequest
    const _errors = validateFields(body)
    const subTotal = await mergeCartWithProducts(body, _errors, platform)
    const totalPrice = getTotalPrice(_errors, subTotal, body)

    if (_errors.length) return json({ _errors }, { status: 400 })
    else if (!totalPrice) return json({ _errors: [ 'An unknown error occured' ] }, { status: 400 }) // allow us to be in the else below knowing we have a totalPrice
    else {
      const createTransactionResponse = await createTransaction(body.nonce, totalPrice.str) // add nonce to braintree

      if (createTransactionResponse._errors.length) return json({ _errors: createTransactionResponse._errors }, { status: 400 })
      else {
        const orderResponse = await addOrder(body, createTransactionResponse.data, totalPrice) // add order to dgraph

        if (orderResponse._errors?.length) { // error w/ graphql
          await reverseTransaction(createTransactionResponse.data?.id) // reverse transaction
          return json({ _errors: orderResponse._errors }, { status: 400 })
        } else {
          const ordersHtml = await getOrdersEmailHTML(body)

          const emailResponses = await Promise.all([
            sendUsEmail(body, ordersHtml, totalPrice),
            sendThemEmail(body, ordersHtml)
          ])

          return json({ body, createTransactionResponse, totalPrice, order: orderResponse, emailResponses }, { status: 200 })
        }
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler


function validateFields (body: CartRequest) {
  const errors: string[] = []

  if (!body.name) errors.push('Please add Name')
  if (!body.email) errors.push('Please add Email')
  if (!body.address) errors.push('Please add Shipping: Address')
  if (!body.zip) errors.push('Please add Shipping: Zip')
  if (!body.country) errors.push('Please add Shipping: Country')
  if (!body.nonce) errors.push('Please add valid Billing Information')
  if (!body.totalPrice.num || !body.totalPrice.str) errors.push('Please add a price')

  if (!body.cart.length) errors.push('Please add items to your cart')

  return errors
}


async function mergeCartWithProducts (body: CartRequest, errors: string[], platform: Readonly<App.Platform> | undefined) {
  const subTotal: Price =  { str: '', num: 0 }

  if (!errors.length) {
    const kvProducts = await get('MAIN_CACHE', 'products', platform)

    for (const cartItem of body.cart) {
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
      else {
        if (cartItem.quantity && Number.isInteger(cartItem.quantity)) {
          cartItem.price = cartItem.product.price * cartItem.quantity
          subTotal.num += cartItem.price
        } else {
          if (cartItem?.product?.name) errors.push(`Product name: "${ cartItem.product.name }" needs a quantity to proceed`)
          else if (cartItem.productId) errors.push(`Product id: "${ cartItem.productId }" needs a quantity to proceed`)
          else errors.push('All items in cart need a quantity')
        }
      }
    }
  }

  return subTotal
}


function getTotalPrice (errors: string[], subTotal: Price, body: CartRequest) {
  if (errors.length) return null
  else {
    const { totalPrice } = expandSubTotal(subTotal)

    if (!totalPrice.num) errors.push('Provided cart does not have a total price')
    if (totalPrice.str !== body.totalPrice.str) errors.push('Total price in request is wrong')
    return totalPrice
  }
}

async function sendUsEmail (body: CartRequest, ordersHtml: string, totalPrice: Price) {
  return await send({
    to: 'us@feelinglovelynow.com', 
    subject: `$${ totalPrice.str } order placed by ${ body.name }`,
    content: `
      ${ ordersHtml }
    `,
  })
}


async function sendThemEmail (body: CartRequest, ordersHtml: string) {
  return await send({
    to: body.email, 
    subject: `Order placed to Feeling Lovely Now!`,
    content: `
      ${ ordersHtml }
    `,
  })
}


async function getOrdersEmailHTML (body: CartRequest) {
  let orderItemHtml = ''

  for (const cartItem of body.cart) {
    if (cartItem.product) cartItem.product.src = (await import(`../../lib/img/store/${ cartItem.product?.images[0].id }.${ cartItem.product?.images[0].extension }`)).default
    orderItemHtml += getOrderItemHtml(cartItem)
  }

  const html = `
    <div style="padding: 18px 18px 27px 18px; color: #273142; max-width: 100vw; font-size: 16px; background-color:#f9f5f2; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;">
      <div style="font-weight: 600; font-size: 21px; margin-bottom: 9px;">Order summary</div>  
      ${ orderItemHtml }
    </div>
  `

  return html
}


function getOrderItemHtml (cartItem: CartItem) {
  return `
    <div style="border-bottom: 1px solid rgba(206, 211, 214, 0.5); padding-bottom: 24px; margin-bottom: 18px;">
      <div style="margin-bottom: 12px;">
        <img style="float: left; width: 81px; margin-right: 15px;" src="https://feelinglovelynow.com${ cartItem.product?.src }" alt="${ cartItem.product?.name }">
        <div style="font-weight: 600; padding-top: 3px;">${ cartItem.product?.name }</div>
        <div style="clear: both;"></div>
      </div>
      ${ getOrderItemTableHtml(cartItem) }
    </div>
  `
}


function getOrderItemTableHtml (cartItem: CartItem) {
  const width = cartItem.size ? '33' : '50'
  const sizeDisplay = cartItem.size ? 'display: block;' : 'display: none';

  return `
    <div>
      <div style="font-weight: 500; border-bottom: 2px solid rgb(206, 211, 214); margin-bottom: 3px;">
        <div style="width: ${ width }%; float: left;">Quantity</div>
        <div style="width: ${ width }%; float: left; ${ sizeDisplay }">Size</div>
        <div style="width: ${ width }%; float: left;">Price</div>
        <div style="clear: both;"></div>
      </div>

      <div>
        <div style="width: ${ width }%; float: left;">${ cartItem.quantity}</div>
        <div style="width: ${ width }%; float: left; ${ sizeDisplay }">${cartItem.size}</div>
        <div style="width: ${ width }%; float: left;">$${ cartItem.product?.price } USD</div>
        <div style="clear: both;"></div>
      </div>
    </div>      
  `
}