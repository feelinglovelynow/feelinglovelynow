<script lang="ts">
  import  { page } from '$app/stores'
  import Title from '$lib/global/Title.svelte'
  import { enumSourceType } from '$lib/global/enums'
  import getLibraryHref from '$lib/source/getLibraryHref'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let type: enumSourceType | undefined = undefined

  let allHref: string
  let cultureHref: string
  let scienceHref: string
  let productHref: string

  $: if ($page.url) {
    allHref = getLibraryHref($page.url, [ [ 'type', '' ], [ 'count', '' ] ])
    cultureHref = getLibraryHref($page.url, [ [ 'type', 'culture' ], [ 'count', '' ] ])
    scienceHref = getLibraryHref($page.url, [ [ 'type', 'science' ], [ 'count', '' ] ])
    productHref = getLibraryHref($page.url, [ [ 'type', 'product' ], [ 'count', '' ] ])
  }
</script>

<Title text="Select a Type!" noBottom={ true } />
<div class="chips location--nav glow">
  <LoadingAnchor label="All" href={ allHref } css="chip { !type ? 'active' : '' }"/>
  <LoadingAnchor label="Culture" href={ cultureHref } css="chip { type === 'culture' ? 'active' : '' }"/>
  <LoadingAnchor label="Science" href={ scienceHref } css="chip { type === 'science' ? 'active' : '' }"/>
  <LoadingAnchor label="Product" href={ productHref } css="chip { type === 'product' ? 'active' : '' }"/>
</div>
