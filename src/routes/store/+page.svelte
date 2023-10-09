<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import FullProduct from '$lib/components/store/FullProduct.svelte'
  import BriefProduct from '$lib/components/store/BriefProduct.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
  // import Braintree from '$lib/components/forms/Braintree.svelte'

  export let data: PageData
</script>


<Head title="Store" url="store" description="Purchase products" />
<Title text="Release Date 11/11/23" size="two" />

{ #if data.categories?.length }
  <section class="chips">
    <LoadingAnchor label="All" href="/store" css="chip { !data.activeProductSlug && data.activeCategorySlug === '' ? 'active' : '' }"/>

    { #each data.categories as category }
      <LoadingAnchor label={ category.name } css="chip { data.activeCategorySlug === category.slug ? 'active' : '' }" href={ `/store?category=${ category.slug }` } />
    {/each}
  </section>
{ /if }

{ #if data.products?.length }
  <div class="products">
    { #each data.products as product }
      { #if data.activeProductSlug }
        <FullProduct { product} />
      { :else }
        <BriefProduct { product } />
      { /if }
    { /each }
  </div>
{ /if }
<!-- <Braintree /> -->


<style lang="scss">
  .products {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
</style>