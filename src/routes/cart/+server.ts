import Price from '$lib/store/Price'
import send from '$lib/mailchannels/send'
import type { CartRequest, CartItem } from '$lib'


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
    if (cartItem.product) cartItem.product.primaryImage.src = (await import(`../../lib/img/store/${ cartItem.product?.primaryImage.id }.${ cartItem.product?.primaryImage.extension }`)).default
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
        <img style="float: left; width: 81px; margin-right: 15px;" src="https://feelinglovelynow.com${ cartItem.product?.primaryImage.src }" alt="${ cartItem.product?.name }">
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
