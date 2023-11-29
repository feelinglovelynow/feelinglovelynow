<script lang="ts">
  import Title from '$lib/global/Title.svelte'
  import type { Product, Category } from '$lib'
  import BriefProduct from '$lib/store/BriefProduct.svelte'
  import ProductCategories from '$lib/store/ProductCategories.svelte'

  export let products: Product[] | void
  export let productCategories: Category[]
</script>


{ #if products?.length }
  <Title text="Featured Store Items" noBottom={ true } />
  <div class="products">
    { #each products as product (product.slug) }
      <BriefProduct { product } />
    { /each }
  </div>
{ /if }

<ProductCategories categories={ productCategories } doActiveSelection={ false } title="Store Categories" />


<style lang="scss">
  .products {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 1; // get it above the title w/ no bottom on hover
  }
</style>