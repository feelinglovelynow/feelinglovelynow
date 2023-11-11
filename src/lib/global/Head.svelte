<script lang="ts">
  export let title: string
  export let ogImageSrc: string = ''
  export let description: string = ''

  $: fullTitle = title + ' ⋅ Feeling Lovely Now'
</script>

<svelte:head>
  <title>{ fullTitle }</title>
  <meta name="description" content={ description || fullTitle } />
  { #if ogImageSrc }
    <meta property="og:type" content="website" />
    <meta property="og:title" content={ fullTitle } />
    <meta property="og:description" content={ description || fullTitle } />
    <meta property="og:image" content={ ogImageSrc } />
    <meta property="og:image:secure_url" content={ ogImageSrc } />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content={ fullTitle } />
  {/if}
</svelte:head>
