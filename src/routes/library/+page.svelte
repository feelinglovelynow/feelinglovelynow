<script lang="ts">
  import type { Source } from '$lib'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import toastRouteError from '$lib/util/toastRouteError'
  import Button from '$lib/components/forms/Button.svelte'
  import Science from '$lib/components/source/Science.svelte'
  import Product from '$lib/components/source/Product.svelte'
  import Culture from '$lib/components/source/Culture.svelte'
  import IMG_OG_LIBRARY from '$lib/img/og/IMG_OG_LIBRARY.webp'
  import TypeChips from '$lib/components/chips/TypeChips.svelte'
  import AuthorChips from '$lib/components/chips/AuthorChips.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
  import CategoryChips from '$lib/components/chips/CategoryChips.svelte'

  export let data: PageData
  toastRouteError(data)

  const titleParts: string[] = []
  let isShowMoreButtonVisible: boolean
  let isShowMoreButtonLoading: boolean
  let showMoreSourcesButton: HTMLDivElement
  let title: string = 'Welcome to our Library!'
  let visibleSources: Source[] = [ ...(data.sources || []) ] // IF I put data.sourcs into the each block on some page renders it clears data.sources for some reason @ infinite scroll

  $: if (visibleSources?.length) { // Are the number of results showing the 6 initial or 6 additional via infinite scroll / ELSE no more results available
    isShowMoreButtonVisible = Number.isInteger(Number(visibleSources?.length) / 6)
  }

  $: if (showMoreSourcesButton) { // add observer to infinite scroll button
    (new IntersectionObserver(showMoreSources, { rootMargin: '270px' })).observe(showMoreSourcesButton)
  }

  $: if (data.type || data.category || data.author) { // bind title
    titleParts.length = 0
    if (data.type) titleParts.push(data.type.charAt(0).toUpperCase() + data.type.slice(1))
    if (data.category) titleParts.push(data.category.name)
    if (data.author) titleParts.push(data.author.name)
    if (titleParts.length) title = titleParts.join(' ⋅ ')
  }

  async function showMoreSources (entries: IntersectionObserverEntry[]) { // show 6 more sources AND update the url
    if (entries[0].isIntersecting) {
      const visibleCount = visibleSources.length + 6
      const url = new URL($page.url)
      url.searchParams.set('count', String(visibleCount))
      goto(url, { replaceState: true, noScroll: true, keepFocus: true, invalidateAll: false })

      const urlStart = `?start=${ visibleSources.length }`
      const urlEnd = `&end=${ visibleSources.length + 6 }`
      const urlType = data.type ? '&type=' + data.type : ''
      const urlAuthor = data.author?.slug ? '&author=' + data.author?.slug : ''
      const urlCategory = data.category?.slug ? '&category=' + data.category?.slug : ''

      isShowMoreButtonLoading = true

      const fetchResponse = await fetch(`/library/sources${ urlStart }${ urlEnd }${ urlType }${ urlAuthor }${ urlCategory }`)
      const response = await fetchResponse.json()

      if (response?.sources?.length) visibleSources = visibleSources.concat(response.sources)
      else isShowMoreButtonVisible = false

      isShowMoreButtonLoading = false
    }
  }
</script>


<Head { title } ogImageSrc={ IMG_OG_LIBRARY } description="Welcome to our library!" url={ data.href } />
<Title text="Library" size="one" />
<Title text={ title } size="two" />

<div class="content">
  <div class="flow-layout__left">
    <TypeChips type={ data.type } />
    { #if data.categories }
      <CategoryChips type={ data.type } category={ data.category } categories={ data.categories } location="nav" />
    { /if }
    { #if data.authors }
      <AuthorChips author={ data.author } authors={ data.authors } location="nav" />
    { /if }
  </div>

  { #if visibleSources?.length }
    { #each visibleSources as source (source.id) }
      { #if source.type === 'science' }
        <Science { source } type={ data.type } category={ data.category } author={ data.author } css="flow-layout__right-item" location="library" />
      { :else if source.type === 'culture' }
        <Culture { source } type={ data.type } category={ data.category } author={ data.author } css="flow-layout__right-item" location="library" />
      { :else if source.type === 'product' }
        <Product { source } type={ data.type } category={ data.category } author={ data.author } css="flow-layout__right-item" location="library" />
      { /if }
    { /each }
  { :else }
    <Title css="flow-layout__right-item">
      <span>No library items found. Would you love to <LoadingAnchor ssr={ true } href="/library" label="view all" loadWidth="big" />?!</span>
    </Title>
  { /if }

  { #if isShowMoreButtonVisible }
    <div bind:this={ showMoreSourcesButton } class="more-wrapper flow-layout__right-item">
      <Button text="Show more sources" isLoading={ isShowMoreButtonLoading } />
    </div>
  { /if }
  <div class="clear"></div>
</div>


<style lang="scss">
  .content {

    :global(.source) {
      margin-bottom: 1.8rem;
    }

    .more-wrapper {
      display: flex;
      justify-content: center;
    }
  }
</style>
