<script lang="ts">
  import { page } from '$app/stores'
  import type { Author } from '$lib'
  import { afterNavigate } from '$app/navigation'
  import Title from '$lib/components/Title.svelte'
  import getLibraryHref from '$lib/util/getLibraryHref'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let location = ''
  export let authors: Author[]
  export let author: Author | null | undefined

  let query: string
  let allHref: string
  let filterdAuthors: Author[]
  let isAllVisible: boolean = true

  afterNavigate(() => query = '')

  $: if (query || authors) {
    if (!query) {
      isAllVisible = true
      filterdAuthors = [ ...authors ]
    } else {
      filterdAuthors.length = 0
      const lowQuery = query.toLowerCase()
      isAllVisible = 'all'.includes(lowQuery)

      for (const a of authors) {
        if (a.lowName && a.lowName.includes(lowQuery)) filterdAuthors.push(a)
      }

      filterdAuthors = filterdAuthors
    }
  }

  $: if (filterdAuthors) {
    if (filterdAuthors.length && !filterdAuthors[0].href) {
      for (const author of authors) {
        author.lowName = author.name.toLowerCase()
        author.href = getLibraryHref($page.url, [ [ 'author', author.slug ], [ 'count', '' ] ])
      }
    }
  }

  $: if ($page.url) {
    allHref = getLibraryHref($page.url, [ [ 'author', '' ], [ 'count', '' ] ])
  }
</script>


{ #if location === 'nav' }
  <Title text="Select an Author!" noBottom={ true } />
{ /if }
<div class="chips chips--mobile-max-height location--{ location } { location === 'nav' ? 'glow' : '' }">
  { #if location === 'nav' }
    <input class="brand" bind:value={ query } type="text" placeholder="Search" />
  { /if }
  { #if location === 'nav' && isAllVisible }
    <LoadingAnchor label="All" href={ allHref }  css="chip { !author ? 'active' : '' }"/>
  { /if }
  { #each filterdAuthors as a }
    <LoadingAnchor label={ a.name } href={ a.href }  css="chip { author?.slug === a.slug ? 'active' : '' }"/>
  { /each }
</div>
