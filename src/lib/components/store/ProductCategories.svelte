<script lang="ts">
  import type { Category } from '$lib'
  import Title from '$lib/components/Title.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'


  export let title: string = ''
  export let categories: Category[] = []
  export let isAllShowing: boolean = true
  export let doActiveSelection: boolean = true
  export let currentProductSlug: string | null = null
  export let currentCategorySlug: string | null = null
  export let location: 'page' | 'full-product' = 'page'
</script>


{ #if categories?.length }
  { #if title }
    <Title text={ title } noBottom={ true } />
  { /if }

  <section class="chips { location === 'page' ? 'glow' : '' }">
    { #if isAllShowing }
      <LoadingAnchor label="All" href="/store" css="chip { doActiveSelection && !currentProductSlug && currentCategorySlug === null ? 'active' : '' }"/>
    { /if }

    { #each categories as category }
      <LoadingAnchor label={ category.name } css="chip { doActiveSelection && currentCategorySlug === category.slug ? 'active' : '' }" href={ `/store?category=${ category.slug }` } />
    {/each}
  </section>
{ /if }
