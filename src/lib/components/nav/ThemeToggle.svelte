<script lang="ts">
  import { theme } from '$lib/util/store'
  import SVG_HOME from '$lib/svg/nav/SVG_HOME.svg'
  import SVG_MOON from '$lib/svg/nav/SVG_MOON.svg'


  function setTheme () {
    const desiredTheme = ($theme === 'light') ? 'dark' : 'light'

    if (desiredTheme === 'light') {
      document.body.classList.add('theme--light')
      document.body.classList.remove('theme--dark')
    } else {
      document.body.classList.add('theme--dark')
      document.body.classList.remove('theme--light')
    }

    theme.set(desiredTheme)
    fetch(`/set-theme?to=${ desiredTheme }`)
  }
</script>


<button class="theme-toggle top brand hide-on-modal-visible box-shadow" on:click={ setTheme } aria-hidden="true">
  { #if $theme === 'light' }
    { @html SVG_HOME }
  { :else }
    { @html SVG_MOON }
  { /if }
</button>

<button class="theme-toggle bottom brand hide-on-modal-visible box-shadow" on:click={ setTheme } aria-hidden="true">
  { #if $theme === 'light' }
    { @html SVG_HOME }
  { :else }
    { @html SVG_MOON }
  { /if }
</button>


<style lang="scss">
  @import '$lib/scss/variables.scss';

  :global(.theme--light) .theme-toggle {
    color: gold;
  }

  .theme-toggle {
    position: fixed;
    padding: 0.36rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: $zindex-nav;
    transition: opacity $theme-search-speed, transform $theme-search-speed;
    &.top {
      top: $theme-search-top;
      right: 23rem;
      opacity: 1;
      transform: translateY(0);

      @media only screen and (max-width: $move-nav-window-width) { // small screen
        opacity: 0;
        z-index: -1;
        transform: translateY(-0.9rem);
      }
    }
    &.bottom {
      bottom: $theme-search-bottom;
      right: $theme-search-bottom-side;
      opacity: 1;
      transform: translateY(0);

      @media only screen and (min-width: $move-nav-window-width) { // big screen
        opacity: 0;
        z-index: -1;
        transform: translateY(-0.9rem);
      }
    }

    :global(svg) {
      width: 2.7rem;
      height: 2.7rem;
    }
  }
</style>