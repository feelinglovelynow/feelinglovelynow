<script lang="ts">
  import type { Source } from '$lib'
  import type { PageData } from './$types'
  import Head from '$lib/global/Head.svelte'
  import Title from '$lib/global/Title.svelte'
  import { routeCatch } from '$lib/global/catch'
  import Culture from '$lib/source/Culture.svelte'
  import AboutUs from '$lib/global/AboutUs.svelte'
  import Science from '$lib/source/Science.svelte'
  import ChrisPic from '$lib/global/ChrisPic.svelte'
  import SourceProduct from '$lib/source/Product.svelte'
  import formatScience from '$lib/source/formatScience'
  import IMG_OG_HOME from '$lib/img/og/IMG_OG_HOME.webp'
  import SocialSupport from '$lib/global/SocialSupport.svelte'
  import FeaturedProducts from '$lib/store/FeaturedProducts.svelte'
  import sortFeaturedProducts from '$lib/store/sortFeaturedProducts'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let data: PageData
  routeCatch(data)

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
  <ChrisPic />
  <Title text="Aloha!" size="two" />
  <SocialSupport />
  <AboutUs />

  <FeaturedProducts { products } productCategories={ data.productCategories }  />

  <div class="sources">
    { #if culture }
      <Title noBottom={ true } >
        <span class="pr-5">Most recent</span> <LoadingAnchor href="/library?type=culture" label="culture" widthRem={ 2.7 } /> addition to our <LoadingAnchor href="/library" label="library" widthRem={ 2.7 } />!
      </Title>
      <Culture source={ culture } location="home" />
    { /if }

    { #if science }
      <Title noBottom={ true }>
        <span class="pr-5">Most recent</span> <LoadingAnchor href="/library?type=science" label="science" widthRem={ 2.7 } /> addition to our <LoadingAnchor href="/library" label="library" widthRem={ 2.7 } />!
      </Title>
      <Science source={ science } location="home" />
    { /if }

    { #if product }
      <Title noBottom={ true }>
        <span class="pr-5">Most recent</span> <LoadingAnchor href="/library?type=product" label="product" widthRem={ 2.7 } /> addition to our <LoadingAnchor href="/library" label="library" widthRem={ 2.7 } />!
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
