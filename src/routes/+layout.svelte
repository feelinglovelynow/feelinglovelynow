<script lang="ts">
  import '$lib/scss/global.scss'
  import type { Product } from '$lib'
  import Nav from '$lib/nav/Nav.svelte'
  import { updated } from '$app/stores'
  import '@feelinglovelynow/global-style'
  import '@feelinglovelynow/toast/index.css'
  import ShoppingCart from '$lib/store/ShoppingCart.svelte'

  export let data: {
    products: Product[]
  }

  $: mapAllProducts = getMap(data.products)

  function getMap (products: Product[]): Map<number, Product> {
    const map: Map<number, Product> = new Map()

    if (products?.length) {
      for (const product of products) {
        if (product.id) map.set(product.id, product)
      }
    }

    return map
  }
</script>


<svelte:head>
  <meta name="theme-color" content="#fefefe"/>
  <style>
    :root {
      --black-text-color: #273142;
      --light-black-text-color: #515357;
      --green-text-color: green;
      --blue-text-color: #2196F3;
      --red-text-color: #bb0c0c;
      --red-bg-color: #FE544B;
      --gold-text-color: #eac603;
      --light-opacity-bg: rgba(255, 255, 255, 0.95);
      --light-glow: 0.09rem 0.09rem 0.9rem 0.09rem rgba(234, 198, 3, 0.18);
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
</svelte:head>

<div id="fln__layout" class="theme--light" data-sveltekit-reload={ $updated ? '' : 'off' }>
  <Nav />
  <div id="fln__toast-wrapper"></div>
  <ShoppingCart { mapAllProducts } />
  <slot />
</div>
