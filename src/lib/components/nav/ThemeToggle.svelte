<script lang="ts">
  import { theme } from '$lib/theme/theme'
  import { browser } from '$app/environment'
  import SVG_HOME from '$lib/svg/nav/SVG_HOME.svg'
  import SVG_MOON from '$lib/svg/nav/SVG_MOON.svg'

  $: layout = browser ? document.getElementById('fln__layout') : null

  function setTheme () {
    const desiredTheme = ($theme === 'light') ? 'dark' : 'light'

    if (layout) {
    theme.set(desiredTheme)
      if (desiredTheme === 'light') {
        layout.classList.add('theme--light')
        layout.classList.remove('theme--dark')
      } else {
        layout.classList.add('theme--dark')
        layout.classList.remove('theme--light')
      }
    fetch(`/set-theme?to=${ desiredTheme }`)
    }

  }
</script>


<button class="theme-toggle top brand nav__mini-button hide-on-modal-visible light-glow" on:click={ setTheme } aria-hidden="true">
  { #if $theme === 'light' }
    { @html SVG_HOME }
  { :else }
    { @html SVG_MOON }
  { /if }
</button>

<button class="theme-toggle bottom brand nav__mini-button hide-on-modal-visible light-glow" on:click={ setTheme } aria-hidden="true">
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
      right: 22.8rem;
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
      right: 0.98rem;
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