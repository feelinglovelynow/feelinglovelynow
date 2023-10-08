<script lang="ts">
  import type { Product } from '$lib'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'

  export let origin: 'store'
  export let product: Product

  $: image = product?.images?.length ? product.images[0] : null
</script>


<div class="wrapper { origin }">
  <section class="product">

    { #if image }
      <a href={ `/store?product=${ product.slug }` } class="image">
        <img src={ image.src } alt={ product.name }/>
      </a>
    { /if }

    <LoadingAnchor css="name" href={ `/store?product=${ product.slug }` } label={ `$${ product.price } USD ⋅ ${ product.name }` } />

    <!-- <div class="chips">
      { #each product.categories as category }
        <LoadingAnchor href={ `/store?category=${ category.slug }`} label={ category.name }  css="chip { false ? 'active' : '' }"/>
      {/each}
    </div> -->
  </section>
</div>


<style lang="scss">
  .wrapper {
    &.store {
      width: 97vw;
      max-width: 97vw;
      margin: 0 auto 1.8rem auto;

      @media only screen and (min-width: 561px) { // medium screen
        width: 50%;
      }

      @media only screen and (min-width: 921px) { // big screen
        width: 33%;
      }

      .product {
        margin: 0 0.9rem;

        .image {
          display: block;
          text-align: center;

          img {
            width: auto;
            max-height: 39rem;
            max-width: 100%;
          }
        }

        :global(.name) {
          display: block;
          text-align: center;
        }
      }
    }
  }
</style>
