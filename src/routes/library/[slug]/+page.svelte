<script lang="ts">
  import type { Source } from '$lib'
  import { page } from '$app/stores'
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import formatScience from '$lib/util/formatScience'
  import toastRouteError from '$lib/util/toastRouteError'
  import Science from '$lib/components/source/Science.svelte'
  import Product from '$lib/components/source/Product.svelte'
  import Culture from '$lib/components/source/Culture.svelte'

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
  { #if source.type === 'science' }
    <Science { source } location="source-page" />
  { :else if source?.type === 'culture' }
    <Culture { source } location="source-page" />
  { :else if source?.type === 'product' }
    <Product { source } location="source-page" />
  { /if }
{ /if }
