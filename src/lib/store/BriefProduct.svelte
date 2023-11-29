<script lang="ts">
  import type { Product } from '$lib'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let product: Product
</script>

<div class="wrapper">
  <section class="glow">
    <LoadingAnchor css="anchor" href={ `/store?product=${ product.slug }` } widthRem={ 3.6 }>
      <div class="image">
        { #if product.primaryImage?.src }
          <img src={ product.primaryImage.src } alt={ product.name } loading="lazy"/>
        { /if }
      </div>

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
      box-shadow: var(--glow);
      &:hover {
        box-shadow: var(--glow), 0 0 0 .2rem rgba(234, 198, 3, 0.63);

        img {
          scale: 1.02;
        }
      }

      @media only screen and (min-width: 561px) { // medium screen
        margin: 0 0.9rem;
      }

      :global(.anchor) {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1.8rem;
      }

      .image {
        aspect-ratio: 1/1;
        width: auto;
        max-height: 39rem;
        min-width: 20rem;
        max-width: 100%;
        min-height: 22rem;
        display: block;
        text-align: center;
        margin-bottom: 0.6rem;

        img {
          height: 100%;
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
