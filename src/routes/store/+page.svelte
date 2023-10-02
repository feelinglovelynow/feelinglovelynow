<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Product from '$lib/components/store/Product.svelte'
  // import Braintree from '$lib/components/forms/Braintree.svelte'

  export let data: PageData
</script>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Store" url="store" description="Purchase products" />
  <Title text="Store" size="two" />

  { #if data.products?.length }
    { #each data.products as product }
      <Product { product } />
    { /each }
  { /if }
  <!-- <Braintree /> -->
  { :else }
    <Title text="Release Date 11/11/23" size="two" />
{ /if }
