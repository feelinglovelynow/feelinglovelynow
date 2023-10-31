<script lang="ts">
  import Price from '$lib/store/Price'
  import { cart } from '$lib/store/cart'
  import type { Cart, Product } from '$lib'
  import loopCart from '$lib/store/loopCart'
  import showToast from '@feelinglovelynow/toast'
  import SVG_CART from '$lib/svg/SVG_CART.svg'
  import PaypalCheckout from '$lib/store/PaypalCheckout'
  import updateCartQuantity from '$lib/store/updateCartQuantity'
  import SimpleLoader from '$lib/components/SimpleLoader.svelte'
  import { Modal, type ShowModal, type HideModal } from '@feelinglovelynow/svelte-modal'

  export let allProducts: undefined | Product[] = undefined

  let showModal: ShowModal
  let hideModal: HideModal
  let cartItems: Cart = []
  let salesTax = new Price()
  let subTotal = new Price()
  let shipping = new Price()
  let totalPrice = new Price()
  let divPaypalLoading: HTMLDivElement
  let divPaypalCheckout: HTMLDivElement

  const paypalCheckout = new PaypalCheckout()

  $: if ($cart && divPaypalCheckout) {
    const response = loopCart($cart, allProducts)

    if (response) {
      subTotal = response.subTotal
      salesTax = response.salesTax
      shipping = response.shipping
      totalPrice = response.totalPrice
      cartItems = response.cartItems

      paypalCheckout.create(divPaypalCheckout, divPaypalLoading, $cart, totalPrice, hideModal)
    }
  }

  function bindModalFunctions (e: CustomEvent<any>) {
    hideModal = e.detail.hideModal
    showModal = e.detail.showModal
  }

  function showCartUpdatedToast () {
    setTimeout(() => { // setTimeout allows inner fn to happen after updateCartQuantity() AND loopCart()
      if ($cart.length) showToast({ type: 'success', items: [ `Item quantity and Paypal checkout updated, with the updated total price: <strong>$${ totalPrice.str } USD</strong>` ] })
    })
  }
</script>



<div class="{ $cart.length > 0 ? 'visible' : '' }" id="shopping-cart-button">
  <button on:click={ showModal } class="brand glow">{ @html SVG_CART }</button>
  <button on:click|stopPropagation={ showModal } class="count">{ $cart.length }</button>
</div>


<div class="cart">
  <!-- <Modal header="Shopping Cart" on:functions={ bindModalFunctions }> -->
  <Modal header="Release Date ⋅ 11/11/23" on:functions={ bindModalFunctions }>
    <div class="total-price">
      { `Sub Total $${ subTotal.str } ⋅ Shipping $${ shipping.str } ⋅ Sales Tax $${ salesTax.str } ⋅` }
      <strong>{ `Total Price $${ totalPrice.str } USD` }</strong>
    </div>

    <div class="cart-items">
      { #each cartItems as c, cartIndex (c.id) }
        { #if c.product }
          <div class="cart-item">
            <div class="img-wrapper">
              <img src={ c.product.primaryImage.src } alt={ c.product.name } />
            </div>
            <div class="info">
              <div class="name">{ c.product.name }</div>
              <div class="price">Item Price: ${ c.product.price } USD</div>
              <div class="quantity-wrapper">
                <span>Quantity:</span> 
                <select on:change={ x => { updateCartQuantity($cart, hideModal, cartIndex, x.currentTarget.value); showCartUpdatedToast(); } } value={ c.quantity } class="brand">
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

    <div class="papyrus two options-head">Preferred purchase method?</div>
    <div class="fln__relative" style="display: none;">
      <div bind:this={ divPaypalCheckout } class="cart__paypal-checkout"></div>
      <div bind:this={ divPaypalLoading } class="cart__paypal-loading">
        <SimpleLoader style="paypal" />
      </div>
    </div>
  </Modal>
</div>


<style lang="scss">
  @import '$lib/scss/variables.scss';

  .cart {

    :global(.fln__modal) {
      max-width: 75rem;
    }

    :global(.fln__modal__header) {
      margin-bottom: 0;
    }

    :global(.fln__modal__body) {
      padding: 1.2rem;
    }

    .options-head {
      margin: 1.8rem 0 0.3em 0;
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
      transform: translate(-10.26rem, 0.43rem);
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
      margin-bottom: 1.8rem;
      padding: 0.9rem 0.9rem 0 0.9rem;
      min-height: 25.4rem;
      transition: all 0.9s;

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
      margin-bottom: 1.8rem;
      font-size: 1.8rem;
      text-align: center;
      background-color: var(--input-bg-color);
    }

    .cart-items {
      border-bottom: 1px solid var(--border-color);

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
    position: relative;
    max-height: 0;
    opacity: 0;
    transition: all 0.9s;
    &.visible {
      opacity: 1;
      max-height: 8.1rem;
    }

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
