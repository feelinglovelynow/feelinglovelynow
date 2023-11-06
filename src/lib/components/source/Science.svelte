<script lang="ts">
  import { afterNavigate } from '$app/navigation'
  import { enumSourceType } from '$lib/util/enums'
  import type { Source, Author, Category } from '$lib'
  import SVG_SCRIBD from '$lib/svg/logo/SVG_SCRIBD.svg'
  import SVG_PUBMED from '$lib/svg/logo/SVG_PUBMED.svg'
  import SVG_ACADEMIA from '$lib/svg/logo/SVG_ACADEMIA.svg'
  import SVG_INTERNET_ARTICLE from '$lib/svg/SVG_INTERNET_ARTICLE.svg'
  import CategoryChips from '$lib/components/chips/CategoryChips.svelte'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let css = ''
  export let source: Source
  export let location = 'sources'
  export let type: enumSourceType | undefined = undefined
  export let author: Author | null | undefined = undefined
  export let category: Category | null | undefined = { name: '', slug: '' }

  let displayCategory: Category

  if (location !== 'search' && category) {
    displayCategory = { ...category }
    afterNavigate(() => {
      if (category) displayCategory = { ...category }
    })
  }
</script>


<section class="source type--science location--{ location } { css } { location !== 'search--source-titles' && location !== 'search--with-quote' ? 'glow' : ''}">
  <div class="head">
    <a class="publisher" href={ source.url } target="_blank" rel="noreferrer" aria-hidden="true">
      { #if source.urlType === 'academia' }
        { @html SVG_ACADEMIA }
      { :else if source.urlType === 'pubmed' }
        { @html SVG_PUBMED }
      { :else if source.urlType === 'scribd' }
        { @html SVG_SCRIBD }
      { :else if source.urlType === 'internet' }
        { @html SVG_INTERNET_ARTICLE }
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
          <span>⋅</span>
        { /if }
        { #if source.authors }
          { #each source.authors as a, i }
            <LoadingAnchor href={ `/library?author=${ a.slug }${ type ? '&type=' + type : '' }${ displayCategory?.slug ? '&category=' + displayCategory.slug : '' }` } css="{ author?.id === a.id ? 'active': '' }" label="{ a.name || undefined }" />
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

  { #if type && source.categories?.length }
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
