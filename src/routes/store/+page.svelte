<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import Braintree from '$lib/components/forms/Braintree.svelte'
  import FullProduct from '$lib/components/store/FullProduct.svelte'
  import BriefProduct from '$lib/components/store/BriefProduct.svelte'
  import ProductCategories from '$lib/components/store/ProductCategories.svelte'
  import { Modal, type ShowModal, type OnModalHide } from '@sensethenlove/svelte-modal'

  let showModal: ShowModal
  let shoppingCartCount = 0

  export let data: PageData
</script>


<Modal header="Shopping Cart" on:functions={ e => showModal = e.detail.showModal }>
  <Braintree />
</Modal>
<Head title="Store" url="store" description="Purchase products" />
<!-- <Title text="Store" size="two" /> -->
<Title text="Release Date ⋅ 11/11/23" size="two" />

{ #if shoppingCartCount > 0 }
  <div class="shoping-cart">
    <button on:click={ showModal } class="brand">Shoping Cart</button>
    <div class="count">1</div>
  </div>
{ /if }

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
  .products {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .shoping-cart {
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