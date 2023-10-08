<script lang="ts">
  import { onMount } from 'svelte'
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

  let darkClass: string
  let lightClass: string
  let darkBackgroundDiv: HTMLDivElement
  let lightBackgroundDiv: HTMLDivElement

  const images = {
    light: [
      { src: IMG_LIGHT_1, alt: 'Lady meditating in snow with energy ball around her' },
      { src: IMG_LIGHT_2, alt: 'Friends meditating in jungle with energy ball around them' },
      { src: IMG_LIGHT_3, alt: 'Friends meditating near water tree and mountain' },
      { src: IMG_LIGHT_4, alt: 'Lady meditating in space' },
      { src: IMG_LIGHT_5, alt: 'Meditating with heart glowing with light' },
      { src: IMG_LIGHT_6, alt: 'Friends meditating by tree' },
      { src: IMG_LIGHT_1, alt: 'Lady meditating in snow with energy ball around her' },
      { src: IMG_LIGHT_2, alt: 'Friends meditating in jungle with energy ball around them' },
    ],
    dark: [
      { src: IMG_DARK_1, alt: 'Lady meditating by ocean and mountain with heart glowing' },
      { src: IMG_DARK_2, alt: 'Light body group meditating by forest' },
      { src: IMG_DARK_3, alt: 'Friends meditating by tree' },
      { src: IMG_DARK_4, alt: 'Abstract meditator with heart glowing' },
      { src: IMG_DARK_5, alt: 'Lady meditating in space' },
      { src: IMG_DARK_6, alt: 'Heart glowing meditator' },
      { src: IMG_DARK_1, alt: 'Lady meditating by ocean and mountain with heart glowing' },
      { src: IMG_DARK_2, alt: 'Light body group meditating by forest' },
    ]
  }

  switch ($theme) {
    case 'light':
      lightClass = 'flex one'
      darkClass = 'none zero'
      break
    case 'dark':
      darkClass = 'flex one'
      lightClass = 'none zero'
      break
  }

  let onThemeToggled: boolean

  theme.subscribe(t => {
    if (onThemeToggled) {
      switch (t) {
        case 'light':
          lightClass = 'flex zero'
          darkClass = 'flex zero'
          setTimeout(() => lightClass = 'flex one')
          setTimeout(() => darkClass = 'none zero', 1000)
          break
        case 'dark':
          darkClass = 'flex zero'
          lightClass = 'flex zero'
          setTimeout(() => darkClass = 'flex one')
          setTimeout(() => lightClass = 'none zero', 1000)
          break
      }
    }

    onThemeToggled = true
  })
</script>


<div class="background { lightClass }" aria-hidden="true" bind:this={ lightBackgroundDiv }>
  { #each images.light as image }
    <div class="img-wrapper"><img src={ image.src } alt={ image.alt } loading="lazy" /></div>
  { /each }
</div>

<div class="background { darkClass }" aria-hidden="true" bind:this={ darkBackgroundDiv }>
  { #each images.dark as image }
    <div class="img-wrapper"><img src={ image.src } alt={ image.alt } loading="lazy" /></div>
  { /each }
</div> 
  

<style lang="scss">
  @import '$lib/scss/variables.scss';

  .background {
    opacity: 0;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
    transition: all $theme-swap-speed;
    position: fixed; // so it's not scrollable
    &.visible {
      opacity: 1;
    }
    &.flex {
      display: flex;
    }
    &.none {
      display: none;
    }
    &.one {
      opacity: 1;
    }
    &.zero {
      opacity: 0;
    }

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
