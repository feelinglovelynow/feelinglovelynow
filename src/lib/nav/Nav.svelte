<script lang="ts">
  import '$lib/nav/Nav.scss'
  import { cart } from '$lib/store/cart'
  import SVG_CART from '$lib/svg/SVG_CART.svg'
  import Flower from '$lib/sacred/Flower.svelte'
  import SVG_HOME from '$lib/svg/nav/SVG_HOME.svg'
  import SVG_STORE from '$lib/svg/nav/SVG_STORE.svg'
  import SVG_SUPPORT from '$lib/svg/nav/SVG_SUPPORT.svg'

  function openCart () {
    const btn = document.querySelector('#shopping-cart-button button') as HTMLButtonElement | undefined
    if (btn) btn.click()
  }

  function smoothToTop () {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  }
</script>


<div class="nav">
  <div class="top-mobile background"></div>
  <div class="logo hide-on-modal-visible">
    <a href="/" aria-label="Scroll to top of page">      
      <Flower metatronsCube={ true } color="var(--gold-text-color)" fruit={ true }  />
    </a>
  </div>

  <div class="name-wrapper hide-on-modal-visible">
    <button type="button" on:click={ () => { smoothToTop() } } class="name">Feeling Lovely Now</button>
  </div>

  <nav class="hide-on-modal-visible background">
    <a href="/" class="item" aria-label="Scroll to top of page">
      { @html SVG_HOME }
      <span>Home</span>
    </a>

    <a href="#products" class="item" aria-label="Scroll to products section">
      { @html SVG_STORE }
      <span>Poducts</span>
    </a>

    <button class="item" on:click={ () => { openCart() } } aria-label="Open shopping cart modal">
      { @html SVG_CART }
      <span>Cart</span>
      { #if $cart.length > 0 }
        <div class="count">{ $cart.length }</div>
      { /if }
    </button>

    <a href="#about" class="item" aria-label="Scroll to about section">
      { @html SVG_SUPPORT }
      <span>About</span>
    </a>
  </nav>
</div>
