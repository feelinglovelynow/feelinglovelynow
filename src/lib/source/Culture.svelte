<script lang="ts">
  import { enumSourceType } from '$lib/global/enums'
  import type { Source, Author, Category } from '$lib'
  import AuthorChips from '$lib/chips/AuthorChips.svelte'
  import YoutubeEmbed from '$lib/global/YoutubeEmbed.svelte'
  import CategoryChips from '$lib/chips/CategoryChips.svelte'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let css = ''
  export let source: Source
  export let location: string
  export let type: enumSourceType | undefined = undefined
  export let author: Author | null | undefined = undefined
  export let category: Category | null | undefined = undefined
</script>


<section class="source type--culture location--{ location } { css } { location !== 'search--source-titles' ? 'glow' : ''}">
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
    <div class="description">{ @html source.description }</div>
  </div>

  { #if source?.url }
    { #if source?.urlType === 'youtube' }
      <YoutubeEmbed url={ source.url } />
    { :else if source?.urlType === 'soundcloud' }
      { @html source.url }
    { /if }
  { /if }

  { #if type && source?.categories?.length }
    <CategoryChips { type } { category } categories={ source.categories } location="culture" />
  { /if }
</section>
