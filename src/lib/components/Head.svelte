<script lang="ts">
  export let title: string
  export let url: string = ''
  export let ogImageSrc: string = ''
  export let description: string = ''

  let fullTitle: string

  $: if (title) setFullTitle()

  function setFullTitle () {
    fullTitle = title + ' ⋅ Feeling Lovely Now'
  }
</script>

<svelte:head>
  <title>{ fullTitle }</title>
  <meta name="description" content={ description || fullTitle } />
  { #if ogImageSrc }
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.feelinglovelynow.com/{ url }" />
    <meta property="og:image" content={ ogImageSrc } />
    <meta property="og:image:secure_url" content={ ogImageSrc } />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:alt" content={ fullTitle } />
  {/if}
</svelte:head>
