<script lang="ts">
  import  { page } from '$app/stores'
  import { afterNavigate } from '$app/navigation'
  import SVG_SCRIBD from '$lib/svg/logo/SVG_SCRIBD.svg'
  import SVG_PUBMED from '$lib/svg/logo/SVG_PUBMED.svg'
  import SVG_ACADEMIA from '$lib/svg/logo/SVG_ACADEMIA.svg'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
  import CategoryChips from '$lib/components/chips/CategoryChips.svelte'
  import type { Source, Author, Category, SourceType } from '$lib/types/all'

  export let css = ''
  export let source: Source
  export let location = 'sources'
  export let type: SourceType = undefined
  export let author: Author | null | undefined = undefined
  export let category: Category | null | undefined = { name: '', slug: '' }

  let ssr: boolean
  let displayCategory: Category

  $: if ($page?.route?.id) {
    ssr = Boolean($page.route.id === '/library')
  }

  if (location !== 'search' && category) {
    displayCategory = { ...category }
    afterNavigate(() => {
      if (category) displayCategory = { ...category }
    })
  }
</script>


<section class="source type--science location--{ location } { css }">
  <div class="head">
    <a class="publisher" href={ source.url } target="_blank" rel="noreferrer" aria-hidden="true">
      { #if source.urlType === 'academia' }
        { @html SVG_ACADEMIA }
      { :else if source.urlType === 'pubmed' }
        { @html SVG_PUBMED }
      { :else if source.urlType === 'scribd' }
        { @html SVG_SCRIBD }
      { /if }
    </a>
    <div class="flex">
      { #if location === 'source-page' }
        <a href={ source.url } class="title" target="_blank" rel="noreferrer">{ source.title }</a>
      { :else }
        <LoadingAnchor href={ `/library/${ source.slug }` } css="title" label={ source.title } />
      { /if }
      <p>
        { #if source.publicationLocation }
          <a href={ source.url } target="_blank" rel="noreferrer">{ source.publicationLocation }{ #if source.publicationYear }, { source.publicationYear }{ /if }</a>
        { /if }
        { #if source.authors }
          <span>⋅</span>
          { #each source.authors as a, i }
            <LoadingAnchor href={ `/library?author=${ a.slug }${ type ? '&type=' + type : '' }${ displayCategory?.slug ? '&category=' + displayCategory.slug : '' }` } { ssr } css="{ author?.id === a.id ? 'active': '' }" label="{ a.name || undefined }" />
            { #if i+1 !== source.authors.length }
              <span>⋅</span>
            { /if }
          { /each }
        { /if }
      </p>
    </div>
  </div>
  { #if location === 'search--with-quote' }
    <div class="fav-head">Quote:</div>
  { :else if location !== 'search--source-titles'  }
    <div class="fav-head">{ displayCategory?.name ? `Favorite ${ displayCategory.name } Quotes:` : 'Favorite Quotes:' }</div>
  { /if }

  { #if source.quotes?.length }
    <ol>
      { #each source.quotes as quote }
        <li>{ @html quote.text }</li>
      { /each }
    </ol>
  { /if }

  { #if source.categories?.length }
    <CategoryChips { type } category={ displayCategory } categories={ source.categories } location="science" />
  { /if }
</section>


<style lang="scss">
  ol {
    li {
      :global(br) {
        margin-bottom: 0.45rem;
      }
    }
  }
</style>
