<script lang="ts">
  import type { Product, Category } from '$lib'
  import Title from '$lib/components/Title.svelte'
  import BriefProduct from '$lib/components/store/BriefProduct.svelte'
  import ProductCategories from '$lib/components/store/ProductCategories.svelte'

  export let products: Product[]
  export let productCategories: Category[]
</script>


{ #if products?.length }
  <Title text="Featured Store Items" noBottom={ true } />
  <div class="products">
    { #each products as product }
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