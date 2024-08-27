<script lang="ts">
  import { cart } from '$lib/store/cart'
  import loopCart from '$lib/store/loopCart'
  import SVG_CART from '$lib/svg/SVG_CART.svg'
  import { showToast } from '@feelinglovelynow/toast'
  import PaypalCheckout from '$lib/store/PaypalCheckout'
  import type { Cart, Product, ExpandedSubTotal } from '$lib'
  import updateCartQuantity from '$lib/store/updateCartQuantity'
  import { Modal, type ShowModal, type HideModal } from '@feelinglovelynow/svelte-modal'

  export let mapAllProducts: Map<number, Product>

  let savings: string
  let showModal: ShowModal
  let hideModal: HideModal
  let cartItems: Cart = []
  let price: ExpandedSubTotal
  let highPrice: ExpandedSubTotal
  let divPaypalLoading: HTMLDivElement
  let divPaypalCheckout: HTMLDivElement

  const paypalCheckout = new PaypalCheckout()

  $: if ($cart && divPaypalCheckout) {
    const r = loopCart($cart, mapAllProducts)

    if (r) {
      price = r.price
      savings = r.savings
      cartItems = r.cartItems
      highPrice = r.highPrice

      if (r.cartItems.length) paypalCheckout.create(divPaypalCheckout, divPaypalLoading, $cart, r.price.totalPrice, hideModal)
    }
  }

  function bindModalFunctions (e: CustomEvent<any>) {
    hideModal = e.detail.hideModal
    showModal = e.detail.showModal
  }

  function showCartUpdatedToast () {
    setTimeout(() => { // setTimeout allows inner fn to happen after updateCartQuantity() AND loopCart()
      if ($cart.length) showToast('success', `Item quantity and Paypal checkout updated, with the updated total price: <strong>$${ price.totalPrice.str } USD</strong>`)
    })
  }
</script>



<div id="shopping-cart-button">
  <button on:click={ showModal } class="brand glow">{ @html SVG_CART }</button>
  <div class="count">{ $cart.length }</div>
</div>


<div class="cart">
  <Modal header="Shopping Cart" on:functions={ bindModalFunctions }>
    <div class="cart-items">
      { #each cartItems as c, cartIndex (c.key) }
        { #if c.product }
          <div class="cart-item">
            <div class="img-wrapper">
              <img src={ c.product.image.src } alt={ c.product.name } />
            </div>
            <div class="info">
              <div class="name">{ c.product.name }</div>
              <div class="price">Item Price: ${ c.product.price } USD</div>
              <div class="quantity-wrapper">
                <span>Quantity:</span> 
                <select aria-label="Quantity" on:change={ x => { updateCartQuantity($cart, hideModal, cartIndex, x.currentTarget.value); showCartUpdatedToast(); } } value={ c.quantity } class="brand">
                  { #each { length: 28 } as _, index }
                    <option value={ index }>{ index }</option>
                  { /each }
                </select>
              </div>
              { #if c.size }
                <div>Size: { c.size }</div>
              { /if }
            </div>
          </div>
        { /if }
      { /each }
    </div>

    { #if cartItems.length }
      <div class="total-price">
        <span class="fln__pr-text">{ `Sub Total $${ price.subTotal.str } ⋅ Shipping $${ price.shipping.str } ⋅ Sales Tax $${ price.salesTax.str } ⋅` }</span>
        <strong class="fln__pr-text">{ `Total Price $${ price.totalPrice.str }` }</strong>
        <span class="fln__pr-text">⋅</span>
        <span class="discount">Savings ${ savings }</span>
      </div>
    { :else }
      <div class="soon">Aloha! Add items to your cart and they will display here! This is also where you may purchse the items in your cart!</div>
    { /if }
    

    <div class="fln__relative">
      <div bind:this={ divPaypalCheckout } class="cart__paypal-checkout { cartItems.length ? 'visible' : '' }"></div>
      <div bind:this={ divPaypalLoading } class="cart__paypal-loading">
        <div class="fln__circle-load paypal"></div>
      </div>
    </div>
  </Modal>
</div>


<style lang="scss">
  @import '$lib/scss/variables.scss';

  .cart {

    :global(.fln__modal) {
      max-width: 90rem !important;
    }

    :global(.fln__modal__header) {
      margin-bottom: 0;
    }

    :global(.fln__modal__body) {
      padding: 1.2rem;
    }

    &__paypal-loading {
      display: none;
      position: absolute;
      left: 50%;
      width: 4.5rem;
      height: 4.5rem;
    }

    :global(.cart__paypal-loading.visible-bottom) {
      display: block;
      bottom: 0;
      transform: translate(-10.26rem, 1.43rem);
    }

    :global(.cart__paypal-loading.visible-middle) {
      display: block;
      top: 50%;
      transform: translate(-2.25rem, -2.25rem);
    }

    &__paypal-checkout {
      position: relative;
      background-color: white;
      border-radius: 0.3rem;
      padding: 0.9rem 0.9rem 0 0.9rem;
      min-height: 0;
      transition: all 0.9s;
      &.visible {
        min-height: 9rem;
      }

      :global(.paypal-buttons) {
        transition: all 0.9s;
      }
    }

    .total-price {
      height: auto;
      width: 100%;
      padding: 0.8rem;
      line-height: 1.32;
      border-radius: 0.3rem;
      color: var(--text-color);
      border: 1px solid var(--border-color);
      margin-bottom: 0.9rem;
      font-size: 1.8rem;
      text-align: center;
      background-color: var(--input-bg-color);

      .discount {
        color: green;
        font-weight: bold;
      }
    }

    .soon {
      margin-top: 1.5rem;
      color: #004085;
      background-color: #cce5ff;
      border-color: #b8daff;
      padding: .72rem 1.2rem;
      border-radius: .25rem;
    }

    .cart-items {
      .cart-item {
        display: flex;
        margin-bottom: 1.8rem;
        padding-bottom: 1.8rem;
        border-bottom: 1px solid var(--border-color-light);
        &:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }

        .img-wrapper {
          width: 12rem;
          height: 12rem;
          display: flex;
          justify-content: center;
          margin-right: 0.9em;
          min-width: 12rem;
          min-height: 12rem;

          img {
            height: 100%;
          }
        }

        .info {
          font-size: 1.71rem;

          .name {
            font-size: 1.53rem;
            font-weight: 600;
            margin-bottom: 0.3rem;
          }

          .quantity-wrapper {
            display: flex;
            align-items: center;
            margin-bottom: 0.3rem;

            select {
              width: 5.4rem;
              height: 3rem;
              margin-left: 0.9rem;
            }
          }

          .price {
            margin-bottom: 0.3rem;
          }
        }
      }
    }
  }

  #shopping-cart-button {
    position: absolute;
    max-height: 0;
    opacity: 0;
    transition: all 0.9s;
    left:-12rem;

    .brand {
      font-size: 1.98rem;
      padding: 0;
      margin-bottom: 1.8rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 5.4rem;
      height: 5.4rem;
    }

    .count {
      position: absolute;
      top: -1.62rem;
      right: -1.42rem;
      color: #fff;
      border: 0.1rem solid var(--red-text-color);
      background-color: var(--red-text-color);
      display: inline-block;
      border-radius: 50%;
      padding: 0;
      min-width: 3.2rem;
      min-height: 3.2rem;
      width: 3.2rem;
      height: 3.2rem;
      display: flex;
      font-size: 1.8rem;
      align-items: center;
      justify-content: center;
    }
  }
</style>
