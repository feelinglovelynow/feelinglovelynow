<script lang="ts">
  import type { Product } from '$lib'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'

  export let product: Product

  $: image = product?.images?.length ? product.images[0] : null
</script>

<div class="wrapper { origin }">
  <section>
    <LoadingAnchor href={ `/store?product=${ product.slug }` } loadWidth="huge">

    { #if image }
      <div class="image">
        <img src={ image.src } alt={ product.name }/>
      </div>
    { /if }

    <div class="name">{ `$${ product.price } USD ⋅ ${ product.name }` }</div>
    </LoadingAnchor>
  </section>
</div>



<style lang="scss">
  @import '$lib/scss/variables.scss';

  .wrapper {
    width: 97vw;
    max-width: 97vw;
    margin: 0 auto 1.8rem auto;

    @media only screen and (min-width: 561px) { // medium screen
      width: 50%;
    }

    @media only screen and (min-width: 921px) { // big screen
      width: 33%;
    }

    section {
      padding: 0;
      margin: 0;
      &:hover {
        box-shadow: 0 0 0 .2rem rgba(0, 123, 255, 0.63);

        img {
          scale: 1.02;
        }
      }

      @media only screen and (min-width: 561px) { // medium screen
        margin: 0 0.9rem;
      }

      :global(a) {
        width: 100%;
        height: 100%;
        display: block;
        padding: 1.8rem;
      }

      .image {
        display: block;
        text-align: center;

        img {
          width: auto;
          max-height: 39rem;
          min-width: 20rem;
          max-width: 100%;
          transition: all 0.9s;
        }
      }

      .name {
        text-align: center;
        font-weight: 500;
      }
    }
  }
</style>
