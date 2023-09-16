<script lang="ts">
  import YoutubeEmbed from '$lib/components/YoutubeEmbed.svelte'
  import type { Source, SourceType, Author, Category } from '$lib'
  import AuthorChips from '$lib/components/chips/AuthorChips.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
  import CategoryChips from '$lib/components/chips/CategoryChips.svelte'

  export let css = ''
  export let source: Source
  export let location: string
  export let type: SourceType = undefined
  export let author: Author | null | undefined = undefined
  export let category: Category | null | undefined = undefined
</script>


<section class="source type--culture location--{ location } { css }">
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

  { #if source?.categories?.length }
    <CategoryChips { type } { category } categories={ source.categories } location="culture" />
  { /if }
</section>
