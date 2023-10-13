<script lang="ts">
  import type { Cart } from '$lib'
  import { cart, set } from '$lib/store/cart'
  import { fade } from 'svelte/transition'
  import type { PageData } from './$types'
  import SVG_CART from '$lib/svg/SVG_CART.svg'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import IMG_OG_STORE from '$lib/img/og/IMG_OG_STORE.webp'
  import Braintree from '$lib/components/forms/Braintree.svelte'
  import FullProduct from '$lib/components/store/FullProduct.svelte'
  import BriefProduct from '$lib/components/store/BriefProduct.svelte'
  import ProductCategories from '$lib/components/store/ProductCategories.svelte'
  import { Modal, type ShowModal, type HideModal } from '@sensethenlove/svelte-modal'

  type Price = {
    str: string
    num: number
  }

  let showModal: ShowModal
  let hideModal: HideModal
  let cartItems: Cart = []
  let taxes: Price = { str: '', num: 0 }
  let subTotal: Price = { str: '', num: 0 }
  let totalPrice: Price = { str: '', num: 0 }

  export let data: PageData

  $: if ($cart) loopCart()

  function loopCart () {
    cartItems = []
    subTotal.num = 0

    for (const cartItem of $cart) {
      const product = data.allProducts?.find(p => p.id === cartItem.productId)

      if (product) {
        cartItems.push({
          product,
          size: cartItem.size,
          quantity: cartItem.quantity,
        })

        subTotal.num += (cartItem.quantity * product.price)
      }
    }

    taxes.num = subTotal.num * 0.09
    totalPrice.num = taxes.num + subTotal.num + 6

    subTotal.str = twoDecimalPlaces(subTotal.num)
    taxes.str = twoDecimalPlaces(taxes.num)
    totalPrice.str = twoDecimalPlaces(totalPrice.num)
  }

  function updateCartQuantity (cartIndex: number, quantity: string) {
    const numQuantity = Number(quantity)

    if (numQuantity) $cart[cartIndex].quantity = numQuantity
    else $cart.splice(cartIndex, 1)

    set($cart)
    if ($cart.length === 0) hideModal()
  }

  function twoDecimalPlaces (num: number) {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  function bindModalFunctions (e: CustomEvent<any>) {
    showModal = e.detail.showModal
    hideModal = e.detail.hideModal
  }
</script>


{ #if data.urlProductSlug }
  <Head title={ data.products[0].name } url={ data.href } ogImageSrc={ data.products[0].images[0].src } description={ data.products[0].name } />
{ :else }
  <Head title="Store" url={ data.href } ogImageSrc={ IMG_OG_STORE } description="Organic t-shirts and books available for purchase!" />
{ /if }

<div class="cart">
  <Modal header="Shopping Cart" on:functions={ bindModalFunctions }>
    <div class="total-price">
      { `Sub Total $${ subTotal.str } USD ⋅ Shipping $6.00 USD ⋅ Taxes $${ taxes.str } USD ⋅` }
      <strong>{ `Total Price $${ totalPrice.str } USD` }</strong>
    </div>

    { #each cartItems as c, cartIndex }
      { #if c.product }
        <div class="cart-item">
          <div class="img-wrapper">
            <img src={ c.product.images[0].src } alt={ c.product.name } />
          </div>
          <div class="info">
            <div class="name">{ c.product.name }</div>
            <div class="price">Item Price: ${ c.product.price } USD</div>
            <div class="quantity-wrapper">
              <span>Quantity:</span> 
              <select on:change={ x => updateCartQuantity(cartIndex, x.currentTarget.value) } value={ c.quantity } class="brand">
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

    <Braintree />
  </Modal>
</div>

{ #if $cart.length > 0 }
  <div transition:fade={{ delay: 90, duration: 600 }} id="shoping-cart-button">
    <button on:click={ showModal } class="brand">{ @html SVG_CART }</button>
    <div class="count">{ $cart.length }</div>
  </div>
{ /if }

<!-- <Title text="Store" size="two" /> -->
<Title text="Release Date ⋅ 11/11/23" size="two" />

{ #if !data.urlProductSlug }
  <ProductCategories categories={ data.categories } currentCategorySlug={ data.urlCategorySlug } />
{ /if }

{ #if data.products?.length }
  <div class="products">
    { #each data.products as product }
      { #if data.urlProductSlug }
        <FullProduct { product} />
      { :else }
        <BriefProduct { product } />
      { /if }
    { /each }
  </div>
{ /if }

{ #if data.urlProductSlug }
  <ProductCategories categories={ data.categories } currentCategorySlug={ data.urlCategorySlug } currentProductSlug={ data.urlProductSlug } />
{ /if }


<style lang="scss">
  :global(.stl--modal-is-visible .nav),
  :global(.stl--modal-is-visible .theme-toggle),
  :global(.stl--modal-is-visible .search__button) {
    position: relative !important;
    z-index: 1 !important;
  }

  .cart {

    :global(.stl--modal) {
      max-width: 85rem;
    }

    :global(.stl--modal__header) {
      margin-bottom: 0;
    }

    .total-price {
      height: auto;
      width: 100%;
      padding: 0.8rem;
      line-height: 1.32;
      border-radius: 3px;
      color: var(--text-color);
      border: 1px solid var(--input-border-color);
      margin-bottom: 1.8rem;
      font-size: 1.8rem;
      text-align: center;
      background-color: var(--input-bg-color);
    }

    .cart-item {
      display: flex;
      margin-bottom: 1.8rem;
      padding-bottom: 1.8rem;
      border-bottom: 1px solid var(--input-border-color);

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
        .name {
          font-weight: 500;
          margin-bottom: 0.3rem;
        }

        .quantity-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 0.3rem;

          select {
            width: 4.5rem;
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

  .products {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  #shoping-cart-button {
    position: relative;

    .brand {
      font-size: 1.98rem;
      padding: 0.9rem 1.2rem;
      margin-bottom: 1.8rem;
    }

    .count {
      position: absolute;
      top: -1.62rem;
      right: -1.42rem;
      color: #fff;
      background-color: var(--red-text-color);
      display: inline-block;
      border-radius: 50%;
      width: 3.2rem;
      height: 3.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>