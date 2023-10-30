<script lang="ts">
  import type { PageData } from './$types'
  import type { Product, Source } from '$lib'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import formatScience from '$lib/util/formatScience'
  import AboutUs from '$lib/components/AboutUs.svelte'
  import IMG_OG_HOME from '$lib/img/og/IMG_OG_HOME.webp'
  import toastRouteError from '$lib/util/toastRouteError'
  import GuitarPic from '$lib/components/GuitarPic.svelte'
  import Culture from '$lib/components/source/Culture.svelte'
  import Science from '$lib/components/source/Science.svelte'
  import SocialSupport from '$lib/components/SocialSupport.svelte'
  import SourceProduct from '$lib/components/source/Product.svelte'
  import BriefProduct from '$lib/components/store/BriefProduct.svelte'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'
  import ProductCategories from '$lib/components/store/ProductCategories.svelte'

  export let data: PageData
  toastRouteError(data)

  let products: Product[] = []
  let culture: Source | undefined = undefined
  let product: Source | undefined = undefined
  let science: Source | undefined = undefined


  $: if (data.products) {
    products = []

    for (const product of data.products) {
      if (Number.isInteger(product.homeDisplayOrder)) products.push(product)
    }

    products = products.sort((a, b) => Number(a.homeDisplayOrder > b.homeDisplayOrder) - Number(a.homeDisplayOrder < b.homeDisplayOrder)) // sort by homeDisplayOrder
  }


  $: if (data.sources) {
    for (const source of data.sources) {
      if (!science && source.type === 'science') science = source
      else if (!culture && source.type === 'culture') culture = source
      else if (!product && source.type === 'product') product = source

      if (science && culture && product) break
    }

    science = formatScience(science)
  }
</script>


<Head title="Home" ogImageSrc={ IMG_OG_HOME } description="Welcome to Feeling Lovely Now!" />
<GuitarPic />
<Title text="Aloha!" size="two" />
<SocialSupport />
<AboutUs />

{ #if products?.length }
  <Title text="Featured Store Items" noBottom={ true } />
  <div class="products">
    { #each products as product }
      <BriefProduct { product } />
    { /each }
  </div>
{ /if }

<ProductCategories categories={ data.productCategories } doActiveSelection={ false } title="Store Categories" />

<div class="content">
  { #if culture }
    <Title noBottom={ true } >
      <span class="pr-5">Most recent</span> <LoadingAnchor href="/library?type=culture" label="culture" loadWidth="big" /> addition to our <LoadingAnchor href="/library" label="library" loadWidth="big" />!
    </Title>
    <Culture source={ culture } location="home" />
  { /if }

  { #if science }
    <Title noBottom={ true }>
      <span class="pr-5">Most recent</span> <LoadingAnchor href="/library?type=science" label="science" loadWidth="big" /> addition to our <LoadingAnchor href="/library" label="library" loadWidth="big" />!
    </Title>
    <Science source={ science } location="home" />
  { /if }

  { #if product }
    <Title noBottom={ true }>
      <span class="pr-5">Most recent</span> <LoadingAnchor href="/library?type=product" label="product" loadWidth="big" /> addition to our <LoadingAnchor href="/library" label="library" loadWidth="big" />!
    </Title>
    <SourceProduct source={ product } location="home" />
  { /if }
</div>


<style lang="scss">
  .products {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 1; // get it above the title w/ no bottom on hover
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    :global(.source) {
      width: 100%;

      @media only screen and (min-width: 90rem) { // big screen
        width: calc(100% - 27rem);
      }
    }
  }
</style>
