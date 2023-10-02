<script lang="ts">
  import type { Product } from '$lib'

  export let product: Product
</script>


<section class="product">
  <div class="name">{ product.name }</div>

  <div class="images">
    { #each product.images as image }
      <img src={ image.src } alt={ product.name }/>
    {/each}
  </div>

  <div class="categories">
    { #each product.categories as category }
      { category.name }
    {/each}
  </div>
</section>


<style lang="scss">
  .product {
    .images {
      display: flex;
      
      img {
        width: 100%;
        max-height: 9rem;
        max-width: 9rem;
      }
    }
  }
</style>
