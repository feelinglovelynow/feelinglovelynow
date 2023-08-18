<script lang="ts">
  import { theme } from '$lib/util/store'
  import IMG_LIGHT_1 from '$lib/img/bg/light/IMG_LIGHT_1.webp'
  import IMG_LIGHT_2 from '$lib/img/bg/light/IMG_LIGHT_2.webp'
  import IMG_LIGHT_3 from '$lib/img/bg/light/IMG_LIGHT_3.webp'
  import IMG_LIGHT_4 from '$lib/img/bg/light/IMG_LIGHT_4.webp'
  import IMG_DARK_1 from '$lib/img/bg/dark/IMG_DARK_1.webp'
  import IMG_DARK_2 from '$lib/img/bg/dark/IMG_DARK_2.webp'
  import IMG_DARK_3 from '$lib/img/bg/dark/IMG_DARK_3.webp'
  import IMG_DARK_4 from '$lib/img/bg/dark/IMG_DARK_4.webp'
</script>


{ #if $theme === 'light' }
  <div class="background" aria-hidden="true">
    <div class="img-wrapper"><img src={ IMG_LIGHT_1 } alt="Group meditating by tree & water" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_2 } alt="Love meditation" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_3 } loading="lazy" alt="Kids meditating" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_4 } loading="lazy" alt="Glowing group meditating by forest" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_1 } loading="lazy" alt="Group meditating by tree & water" /></div>
    <div class="img-wrapper"><img src={ IMG_LIGHT_2 } loading="lazy" alt="Love meditation" /></div>
  </div>
{ :else }
  <div class="background" aria-hidden="true">
    <div class="img-wrapper"><img src={ IMG_DARK_1 } alt="Group meditating by tree & water" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_2 } alt="Glowing group meditating by forest" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_3 } loading="lazy" alt="Love meditation" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_4 } loading="lazy" alt="Kids meditating" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_1 } loading="lazy" alt="Group meditating by tree & water" /></div>
    <div class="img-wrapper"><img src={ IMG_DARK_2 } loading="lazy" alt="Love meditation" /></div>
  </div>
{ /if }


<style lang="scss">
  @import '$lib/scss/variables.scss';

  .background {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    position: fixed; // so it's not scrollable
    
    @media only screen and (min-width: $bg-img-swap-window-width) { // big screen
      flex-direction: row;
    }

    .img-wrapper {
      z-index: $zindex-background-images;
      margin: 0;
      aspect-ratio: 1 / 1; // height equal to width so images load in in their done loading location
      
      @media only screen and (min-width: $bg-img-swap-window-width) { // big screen
        width: 50%;
      }

      img {
        width: 100%;
      }
    }
  }
</style>
