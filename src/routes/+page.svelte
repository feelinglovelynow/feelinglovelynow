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
  import sortFeaturedProducts from '$lib/store/sortFeaturedProducts'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'
  import FeaturedProducts from '$lib/components/store/FeaturedProducts.svelte'

  export let data: PageData
  toastRouteError(data)

  let culture: Source | undefined = undefined
  let product: Source | undefined = undefined
  let science: Source | undefined = undefined

  $: products = sortFeaturedProducts(data.products)

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

<main>
  <GuitarPic />
  <Title text="Aloha!" size="two" />
  <SocialSupport />
  <AboutUs />

  <FeaturedProducts { products } productCategories={ data.productCategories }  />

  <div class="sources">
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
</main>


<style lang="scss">
  .sources {
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
