<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Product from '$lib/components/store/Product.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
  // import Braintree from '$lib/components/forms/Braintree.svelte'

  export let data: PageData
</script>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Store" url="store" description="Purchase products" />
  <Title text="Store" size="two" />

  { #if data.categories?.length }
    <section class="chips">
      { #each data.categories as category }
        <LoadingAnchor label={ category.name } css="chip" href="" />
      {/each}
    </section>
  { /if }

  { #if data.products?.length }
    <div class="products">
      { #each data.products as product }
        <Product { product } origin="store" />
      { /each }
    </div>
  { /if }
  <!-- <Braintree /> -->
  { :else }
    <Title text="Release Date 11/11/23" size="two" />
{ /if }


<style lang="scss">
  .products {
    display: flex;
    flex-wrap: wrap;
  }
</style>