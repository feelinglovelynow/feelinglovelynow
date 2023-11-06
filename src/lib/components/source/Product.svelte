<script lang="ts">
  import { enumSourceType } from '$lib/util/enums'
  import type { Source, Author, Category } from '$lib'
  import AuthorChips from '$lib/components/chips/AuthorChips.svelte'
  import CategoryChips from '$lib/components/chips/CategoryChips.svelte'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let css = ''
  export let source: Source
  export let location: string
  export let type: enumSourceType | undefined = undefined
  export let author: Author | null | undefined = undefined
  export let category: Category | null | undefined = undefined

  let images: { default: string }[] = []

  $: if (source?.images?.length) {
    Promise
      .all(source.images.map(img => import(`../../img/source/${ source.id }/${ img.id }.${ img.extension }`)))
      .then(importedImages => images = importedImages)
  }
</script>


<section class="source type--product location--{ location } { css } { location !== 'search--source-titles' ? 'glow' : ''}">
  <div class="header">
    <div class="top">
      { #if location === 'source-page' }
        <a href={ source.url } class="title" target="_blank" rel="noreferrer">{ source.title }</a>
      { :else }
        <LoadingAnchor href={ `/library/${ source.slug }` } css="title" label={ source.title } />
      { /if }
      { #if source?.authors?.length }
        <AuthorChips { author } authors={ source.authors } />
      { /if }
    </div>
    <div class="description">{ source.description }</div>
  </div>

  { #if images?.length }
    <div class="images">
      { #each images as image }
        <a href={ source.url } target="_blank" rel="noreferrer">
          <img src={ image.default } alt="Product" />
        </a>
      { /each }
    </div>
  { /if }

  
  { #if type && source?.categories?.length }
    <CategoryChips { type } { category } categories={ source.categories } location="product" />
  { /if }
</section>


<style lang="scss">
  .images {
    display: flex;
    justify-content: space-between;

    a {
      width: 49%;
      min-width: 49%;

      img {
        width: 100%;
      }
    }
  }
</style>
