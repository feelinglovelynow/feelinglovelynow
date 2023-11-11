<script lang="ts">
  import '$lib/scss/global.scss'
  import Nav from '$lib/nav/Nav.svelte'
  import { updated } from '$app/stores'
  import '@feelinglovelynow/global-style'
  import { theme } from '$lib/theme/theme'
  import type { PageData } from './$types'
  import '@feelinglovelynow/toast/index.css'
  import Search from '$lib/nav/Search.svelte'
  import ThemeToggle from '$lib/nav/ThemeToggle.svelte'
  import Background from '$lib/global/Background.svelte'

  export let data: PageData

  theme.set(data.theme)
</script>


<svelte:head>
  <style>
    :root {
      --black-text-color: #273142;
      --light-black-text-color: #515357;
      --green-text-color: green;
      --blue-text-color: #2196F3;
      --red-text-color: #FE544B;
      --gold-text-color: #eac603;
      --light-opacity-bg: rgba(255, 255, 255, 0.95);
      --light-glow: 0.09rem 0.09rem 0.9rem 0.09rem rgba(234, 198, 3, 0.18);
    }
  </style>

  { #if $theme === 'light' }
    <meta name="theme-color" content="#fefefe"/>
    <style>
      :root {
        --text-color: var(--black-text-color);
        --opacity-bg: var(--light-opacity-bg);
        --anchor-color: var(--green-text-color);
        --papyrus-text-color: var(--blue-text-color);
        --bg-color: #fefefe;
        --input-bg-color: rgb(255, 255, 255, 0.6);
        --border-color: rgb(206, 211, 214);
        --border-color-light: rgba(206, 211, 214, 0.45);
        --bottom-nav-bg: #fefefe;
        --glow: 0.09rem 0.09rem 0.9rem 0.09rem rgba(234, 198, 3, 0.36);
        --focus-box-shadow: 0 0 0 .2rem rgba(0, 123, 255, .21);
        --focus-error-box-shadow: 0 0 0 0.2rem rgba(254, 84, 75, 0.25);
      }
    </style>
  { :else }
    <meta name="theme-color" content="#111111"/>
    <style>
      :root {
        --text-color:  #eceaea;
        --opacity-bg: rgba(0, 0, 0, 0.9);
        --anchor-color: #8bdd10;
        --papyrus-text-color: var(--gold-text-color);
        --bg-color: #111111;
        --input-bg-color: rgb(55, 65, 81, 0.6);
        --border-color: rgb(75, 85, 99);
        --border-color-light: rgba(75, 85, 99, 0.45);
        --bottom-nav-bg: #111111;
        --glow: 0.09rem 0.09rem 0.9rem 0.09rem rgba(234, 198, 3, 0.27);
        --focus-box-shadow: 0 0 0 .2rem rgba(234, 198, 3, 0.63);
        --focus-error-box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, rgb(240, 82, 82) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
      }
    </style>
  { /if }
</svelte:head>

<div id="fln__layout" class="theme--{ $theme || 'dark' }" data-sveltekit-reload={ $updated ? '' : 'off' }>
  <slot />

  <Background localsTheme={ data.theme } />
  <Nav />
  <ThemeToggle />
  <Search />
  <div id="fln__toast-wrapper"></div>
</div>
