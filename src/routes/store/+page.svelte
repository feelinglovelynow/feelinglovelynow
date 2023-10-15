<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import IMG_OG_STORE from '$lib/img/og/IMG_OG_STORE.webp'
  import toastRouteError from '$lib/util/toastRouteError'
  import FullProduct from '$lib/components/store/FullProduct.svelte'
  import BriefProduct from '$lib/components/store/BriefProduct.svelte'
  import ProductCategories from '$lib/components/store/ProductCategories.svelte'
  import ShoppingCart from '$lib/components/store/ShoppingCart.svelte';

  export let data: PageData

  toastRouteError(data)
</script>


{ #if data.urlProductSlug }
  <Head title={ data.products[0].name } url={ data.href } ogImageSrc={ data.products[0].images[0].src } description={ data.products[0].name } />
{ :else }
  <Head title="Store" url={ data.href } ogImageSrc={ IMG_OG_STORE } description="Organic t-shirts and books available for purchase!" />
{ /if }


<ShoppingCart allProducts={ data.allProducts } />
<Title text="Store" size="two" />
<!-- <Title text="Release Date ⋅ 11/11/23" size="two" /> -->

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
</style>
