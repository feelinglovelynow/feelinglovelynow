<script lang="ts">
  import '$lib/components/nav/Nav.scss'
  import { page, navigating } from '$app/stores'
  import SVG_HOME from '$lib/svg/nav/SVG_HOME.svg'
  import SVG_CONTACT from '$lib/svg/nav/SVG_CONTACT.svg'
  import SVG_LIBRARY from '$lib/svg/nav/SVG_LIBRARY.svg'
  import SVG_SUPPORT from '$lib/svg/nav/SVG_SUPPORT.svg'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
  import SVG_FLOWER_OF_LIFE from '$lib/svg/sacred/SVG_FLOWER_OF_LIFE.svelte'

  let activeRoute: string | null | undefined
  $: if ($navigating) setActiveRoute(true)

  setActiveRoute()

  function setActiveRoute (isNavigating?: boolean) {
    activeRoute = (isNavigating) ? $navigating?.to?.route.id : $page.route.id
  }

  function smoothToTop () {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  }
</script>


<div class="nav">
  <div class="logo">
    <LoadingAnchor loadWidth="huge">
      { #if activeRoute?.includes('/library') }
        <SVG_FLOWER_OF_LIFE fruit={ true } merkaba={ true } />
      { :else }
        <SVG_FLOWER_OF_LIFE flower={ true } />
      { /if }
    </LoadingAnchor>
  </div>

  <div class="name-wrapper">
    <button on:click={ () => { smoothToTop() } } class="name">Feeling Lovely Now</button>
  </div>

  <nav class="">
    <LoadingAnchor label="Home" loadWidth="big" css="item { activeRoute === '/' ? 'active' : '' }">{ @html SVG_HOME }</LoadingAnchor>
    <LoadingAnchor label="Library" href="/library" loadWidth="big" css="item { activeRoute?.includes('/library') ? 'active' : '' }">{ @html SVG_LIBRARY }</LoadingAnchor>
    <LoadingAnchor label="Contact" href="/contact" loadWidth="big" css="item { activeRoute === '/contact' ? 'active' : '' }">{ @html SVG_CONTACT }</LoadingAnchor>
    <LoadingAnchor label="Links" href="/links" loadWidth="big" css="item { activeRoute === '/links' ? 'active' : '' }">{ @html SVG_SUPPORT }</LoadingAnchor>
  </nav>
</div>
