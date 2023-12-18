<script lang="ts">
  import '$lib/nav/Nav.scss'
  import { cart } from '$lib/store/cart'
  import Lotus from '$lib/sacred/Lotus.svelte'
  import { page, navigating } from '$app/stores'
  import Flower from '$lib/sacred/Flower.svelte'
  import SVG_HOME from '$lib/svg/nav/SVG_HOME.svg'
  import SVG_STORE from '$lib/svg/nav/SVG_STORE.svg'
  import SVG_LIBRARY from '$lib/svg/nav/SVG_LIBRARY.svg'
  import SVG_SUPPORT from '$lib/svg/nav/SVG_SUPPORT.svg'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  $: activeRoute = ($navigating) ? $navigating?.to?.route.id : $page.route.id

  function smoothToTop () {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  }
</script>


<div class="nav">
  <div class="logo hide-on-modal-visible">
    <LoadingAnchor widthRem={ 3.6 }>      
      { #if activeRoute?.includes('/library')  }
        <Flower merkaba={ true } />
      { :else if activeRoute === '/links'  }
        <Lotus />
      { :else if activeRoute === '/store' }
        <Flower metatronsCube={ true } fruit={ true } flowerSurroundingCircle={ true } strokeWidth={ 6.3 } />
      { :else }
        <Flower flower={ true } flowerSurroundingCircle={ true } />
      { /if }
    </LoadingAnchor>
  </div>

  <div class="name-wrapper hide-on-modal-visible">
    <button on:click={ () => { smoothToTop() } } class="name light-glow">Feeling Lovely Now</button>
  </div>

  <nav class="hide-on-modal-visible light-glow">
    <LoadingAnchor label="Home" widthRem={ 2.7 } css="item { activeRoute === '/' ? 'active' : '' }">{ @html SVG_HOME }</LoadingAnchor>
    <LoadingAnchor label="Store" href="/store" widthRem={ 2.7 } css="item { activeRoute?.includes('/store') ? 'active' : '' }">
      { @html SVG_STORE }
      { #if $cart.length > 0 }
        <div class="count">{ $cart.length }</div>
      { /if }
    </LoadingAnchor>
    <LoadingAnchor label="Library" href="/library" widthRem={ 2.7 } css="item { activeRoute?.includes('/library') ? 'active' : '' }">{ @html SVG_LIBRARY }</LoadingAnchor>
    <LoadingAnchor label="Links" href="/links" widthRem={ 2.7 } css="item { activeRoute === '/links' ? 'active' : '' }">{ @html SVG_SUPPORT }</LoadingAnchor>
  </nav>
</div>
