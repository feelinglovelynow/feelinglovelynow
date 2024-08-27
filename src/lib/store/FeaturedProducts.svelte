<script lang="ts">
  import type { Product } from '$lib'
  import BriefProduct from '$lib/store/BriefProduct.svelte'

  export let products: Product[] | void
</script>


{ #if products?.length }
  <div class="products">
    { #each products as product (product.id) }
      <BriefProduct { product } />
    { /each }
  </div>
{ /if }


<style lang="scss">
  .products {
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
</style>
