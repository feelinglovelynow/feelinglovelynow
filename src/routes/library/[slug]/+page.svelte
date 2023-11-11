<script lang="ts">
  import type { Source } from '$lib'
  import { page } from '$app/stores'
  import type { PageData } from './$types'
  import Head from '$lib/global/Head.svelte'
  import Science from '$lib/source/Science.svelte'
  import Culture from '$lib/source/Culture.svelte'
  import Product from '$lib/source/Product.svelte'
  import formatScience from '$lib/source/formatScience'
  import toastRouteError from '$lib/catch/toastRouteError'

  export let data: PageData
  toastRouteError(data)

  let source: Source | undefined

  $: if ($page.params.slug) {
    for (const s of data.sources) {
      if (s.slug === $page.params.slug) {
        source = formatScience(s)
        break
      }
    }
  }
</script>


<Head title={ source?.title || '' } description={ source?.title || '' } />

{ #if source }
  <main>
    { #if source.type === 'science' }
      <Science { source } location="source-page" />
    { :else if source?.type === 'culture' }
      <Culture { source } location="source-page" />
    { :else if source?.type === 'product' }
      <Product { source } location="source-page" />
    { /if }
  </main>
{ /if }
