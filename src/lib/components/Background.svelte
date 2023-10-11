<script lang="ts">
  import type { Theme } from '$lib'
  import { fly } from 'svelte/transition'
  import { theme } from '$lib/util/store'
  import IMG_DARK_1 from '$lib/img/bg/dark/IMG_DARK_1.webp'
  import IMG_DARK_2 from '$lib/img/bg/dark/IMG_DARK_2.webp'
  import IMG_DARK_3 from '$lib/img/bg/dark/IMG_DARK_3.webp'
  import IMG_DARK_4 from '$lib/img/bg/dark/IMG_DARK_4.webp'
  import IMG_DARK_5 from '$lib/img/bg/dark/IMG_DARK_5.webp'
  import IMG_DARK_6 from '$lib/img/bg/dark/IMG_DARK_6.webp'
  import IMG_LIGHT_1 from '$lib/img/bg/light/IMG_LIGHT_1.webp'
  import IMG_LIGHT_2 from '$lib/img/bg/light/IMG_LIGHT_2.webp'
  import IMG_LIGHT_3 from '$lib/img/bg/light/IMG_LIGHT_3.webp'
  import IMG_LIGHT_4 from '$lib/img/bg/light/IMG_LIGHT_4.webp'
  import IMG_LIGHT_5 from '$lib/img/bg/light/IMG_LIGHT_5.webp'
  import IMG_LIGHT_6 from '$lib/img/bg/light/IMG_LIGHT_6.webp'

  export let localsTheme: Theme

  let isInititalSubscribe = true
  $: visibleImages = images[localsTheme]
  const bgTransitionIn = { y: -9, duration: 450, delay: 0 }
  const bgTransitionOut = { y: 9, duration: 450 }

  const images = {
    light: [
      { key: 'light-1', src: IMG_LIGHT_1, alt: 'Lady meditating in snow with energy ball around her' },
      { key: 'light-2', src: IMG_LIGHT_2, alt: 'Friends meditating on mountain above city' },
      { key: 'light-5', src: IMG_LIGHT_3, alt: 'Meditating with heart glowing with light' },
      { key: 'light-3', src: IMG_LIGHT_4, alt: 'Friends meditating near water tree and mountain' },
      { key: 'light-6', src: IMG_LIGHT_5, alt: 'Friends meditating by tree' },
      { key: 'light-4', src: IMG_LIGHT_6, alt: 'Lady meditating in space' },
      { key: 'light-7', src: IMG_LIGHT_1, alt: 'Lady meditating in snow with energy ball around her' },
      { key: 'light-8', src: IMG_LIGHT_2, alt: 'Friends meditating in jungle with energy ball around them' },
    ],
    dark: [
      { key: 'dark-1', src: IMG_DARK_1, alt: 'Lady meditating by ocean and mountain with heart glowing' },
      { key: 'dark-2', src: IMG_DARK_2, alt: 'Light body group meditating by forest' },
      { key: 'dark-3', src: IMG_DARK_3, alt: 'Friends meditating by tree' },
      { key: 'dark-4', src: IMG_DARK_4, alt: 'Abstract meditator with heart glowing' },
      { key: 'dark-5', src: IMG_DARK_5, alt: 'Lady meditating in space' },
      { key: 'dark-6', src: IMG_DARK_6, alt: 'Heart glowing meditator' },
      { key: 'dark-7', src: IMG_DARK_1, alt: 'Lady meditating by ocean and mountain with heart glowing' },
      { key: 'dark-8', src: IMG_DARK_2, alt: 'Light body group meditating by forest' },
    ]
  }

  theme.subscribe(t => {
    if (!isInititalSubscribe && (t === 'light' || t === 'dark')) visibleImages = images[t] // add new images
    isInititalSubscribe = false // help bypass initial render
  })
</script>


{ #key visibleImages }
  <div in:fly={ bgTransitionIn } out:fly={ bgTransitionOut } class="background" aria-hidden="true">
    { #each visibleImages as image (image.key) }
      <div class="img-wrapper"><img src={ image.src } alt={ image.alt } loading="lazy" /></div>
    { /each }
  </div>
{ /key }
  

<style lang="scss">
  @import '$lib/scss/variables.scss';

  .background {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
    position: fixed; // so it's not scrollable

    .img-wrapper {
      z-index: $zindex-background-images;
      margin: 0;
      width: 50%;
      aspect-ratio: 1 / 1; // height equal to width so images load in in their done loading location

      img {
        height: 100%;
      }
    }
  }
</style>
