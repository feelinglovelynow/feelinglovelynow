<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import AboutUs from '$lib/components/AboutUs.svelte'
  import IMG_OG_HOME from '$lib/img/og/IMG_OG_HOME.webp'
  import toastRouteError from '$lib/util/toastRouteError'
  import GuitarPic from '$lib/components/GuitarPic.svelte'
  import Science from '$lib/components/source/Science.svelte'
  import Culture from '$lib/components/source/Culture.svelte'
  import Product from '$lib/components/source/Product.svelte'
  import SocialSupport from '$lib/components/SocialSupport.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'

  export let data: PageData
  toastRouteError(data)
</script>


<Head title="Home" ogImageSrc={ IMG_OG_HOME } description="Welcome to Feeling Lovely Now!" />
<GuitarPic />
<Title text="Aloha!" size="two" />
<SocialSupport />
<AboutUs />
<div class="content">
  { #if data.culture }
    <Title noBottom={ true } >
      <span class="pr-5">The most recent</span> <LoadingAnchor href="/library?type=culture" label="culture" loadWidth="big" /> addition to our <LoadingAnchor href="/library" label="library" loadWidth="big" />!
    </Title>
    <Culture source={ data.culture } location="home" />
  { /if }

  { #if data.science }
    <Title noBottom={ true }>
      <span class="pr-5">The most recent</span> <LoadingAnchor href="/library?type=science" label="science" loadWidth="big" /> addition to our <LoadingAnchor href="/library" label="library" loadWidth="big" />!
    </Title>
    <Science source={ data.science } location="home" />
  { /if }

  { #if data.product }
    <Title noBottom={ true }>
      <span class="pr-5">The most recent</span> <LoadingAnchor href="/library?type=product" label="product" loadWidth="big" /> addition to our <LoadingAnchor href="/library" label="library" loadWidth="big" />!
    </Title>
    <Product source={ data.product } location="home" />
  { /if }
</div>


<style lang="scss">
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