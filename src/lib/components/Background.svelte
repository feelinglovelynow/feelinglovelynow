<script lang="ts">
  import { theme } from '$lib/util/store'
  import IMG_LIGHT_1 from '$lib/img/bg/light/IMG_LIGHT_1.webp'
  import IMG_LIGHT_2 from '$lib/img/bg/light/IMG_LIGHT_2.webp'
  import IMG_LIGHT_3 from '$lib/img/bg/light/IMG_LIGHT_3.webp'
  import IMG_LIGHT_4 from '$lib/img/bg/light/IMG_LIGHT_4.webp'
  import IMG_LIGHT_5 from '$lib/img/bg/light/IMG_LIGHT_5.webp'
  import IMG_LIGHT_6 from '$lib/img/bg/light/IMG_LIGHT_6.webp'
  import IMG_DARK_1 from '$lib/img/bg/dark/IMG_DARK_1.webp'
  import IMG_DARK_2 from '$lib/img/bg/dark/IMG_DARK_2.webp'
  import IMG_DARK_3 from '$lib/img/bg/dark/IMG_DARK_3.webp'
  import IMG_DARK_4 from '$lib/img/bg/dark/IMG_DARK_4.webp'
  import IMG_DARK_5 from '$lib/img/bg/dark/IMG_DARK_5.webp'
  import IMG_DARK_6 from '$lib/img/bg/dark/IMG_DARK_6.webp'
</script>


{ #if $theme === 'light' }
  <div class="background" aria-hidden="true">
    <div class="img-wrapper"><img src={ IMG_LIGHT_1 } alt="Lady meditating in snow with energy ball around her" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_2 } alt="Friends meditating in jungle with energy ball around them" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_3 } loading="lazy" alt="Friends meditating near water tree and mountain" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_4 } loading="lazy" alt="Heart glowing with light" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_5 } loading="lazy" alt="Heart glowing with light" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_6 } loading="lazy" alt="Glowing group meditating by tree" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_1 } loading="lazy" alt="Lady meditating in snow with energy ball around her" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_2 } loading="lazy" alt="Friends meditating in jungle with energy ball around them" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_3 } loading="lazy" alt="Friends meditating near water tree and mountain" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_4 } loading="lazy" alt="Heart glowing with light" /></div>
  </div>
{ :else }
  <div class="background" aria-hidden="true">
    <div class="img-wrapper"><img src={ IMG_DARK_1 } alt="Lady meditating by ocean and mountain with heart glowing" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_2 } alt="Glowing group meditating by forest" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_3 } loading="lazy" alt="Group meditating by tree" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_4 } loading="lazy" alt="Lady meditating in space" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_5 } loading="lazy" alt="Lady meditating in space" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_6 } loading="lazy" alt="Meditators heart glowing with light" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_1 } loading="lazy" alt="Lady meditating by ocean and mountain with heart glowing" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_2 } loading="lazy" alt="Glowing group meditating by forest" /></div>
  </div>
{ /if }


<style lang="scss">
  @import '$lib/scss/variables.scss';

  .background {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
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
