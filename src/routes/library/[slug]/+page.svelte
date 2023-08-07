<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Science from '$lib/components/source/Science.svelte'
  import Product from '$lib/components/source/Product.svelte'
  import Culture from '$lib/components/source/Culture.svelte'

  export let data: PageData
</script>


<Head title={ data?.source?.title || '' } description={ data?.source?.title || '' } url={ `/source/${ data?.source?.id }` } />

{ #if data.source }
  { #if data.source.type === 'science' }
    <Science source={ data.source } location="source-page" />
  { :else if data.source.type === 'culture' }
    <Culture source={ data.source } location="source-page" />
  { :else if data.source.type === 'product' }
    <Product source={ data.source } location="source-page" />
  { /if }
{ /if }
