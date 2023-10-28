<script lang="ts">
  import type { PageData } from './$types'
  import type { Product } from '$lib'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import toastRouteError from '$lib/util/toastRouteError'
  import IMG_OG_STORE from '$lib/img/og/IMG_OG_STORE.webp'
  import SimpleLoader from '$lib/components/SimpleLoader.svelte'
  import FullProduct from '$lib/components/store/FullProduct.svelte'
  import BriefProduct from '$lib/components/store/BriefProduct.svelte'
  import ShoppingCart from '$lib/components/store/ShoppingCart.svelte'
  import ProductCategories from '$lib/components/store/ProductCategories.svelte'

  export let data: PageData

  toastRouteError(data)

  let isPageLoading = true
  let products: Product[] = []
  let allProducts: Product[] = []


  $: if (data.products) parseProducts()


  async function parseProducts () {
    const mapAllProducts: Map<string, Product> = new Map()
    const activeProducts: Map<string, Product> = new Map()

    for (const product of data.products) {
      mapAllProducts.set(product.id, product)

      for (const category of product.categories) {        
        if ((!data.urlCategorySlug || data.urlCategorySlug === category.slug) && (!data.urlProductSlug || data.urlProductSlug === product.slug)) {
          activeProducts.set(product.id, product)
        }
      }
    }

    products = [...activeProducts.values()]
    allProducts = [...mapAllProducts.values()]

    if (data.urlProductSlug && products.length === 1) { // get data about similarProducts
      const primaryImages = await Promise.all(products[0].similarProducts.map((product: any) => {
        return import(`../../lib/img/store/${ product.primaryImage.id }.webp`)
      }))

      for (let i = 0; i < products[0].similarProducts.length; i++) {
        products[0].similarProducts[i].primaryImage.src = primaryImages[i].default
      }
    }

    if (products.length > 1) products = products.sort((a, b) => Number(a.storeDisplayOrder > b.storeDisplayOrder) - Number(a.storeDisplayOrder < b.storeDisplayOrder)) // sort products by storeDisplayOrder
    isPageLoading = false
  }
</script>


{ #if data.urlProductSlug && products?.length }
  <Head title={ products[0].name } ogImageSrc={ products[0].primaryImage.src } description={ products[0].name } />
{ :else }
  <Head title="Store" ogImageSrc={ IMG_OG_STORE } description="Organic t-shirts and books available for purchase!" />
{ /if }


{ #if isPageLoading }
 <SimpleLoader />
{ :else }
  <ShoppingCart allProducts={ allProducts } />
  <Title text="Store" size="one" />

  { #if !data.urlProductSlug }
    <ProductCategories categories={ data.productCategories } currentCategorySlug={ data.urlCategorySlug } />
  { /if }

  { #if products?.length }
    <div class="products">
      { #each products as product (product.id) }
        { #if data.urlProductSlug }
          <FullProduct { product} />
        { :else }
          <BriefProduct { product } />
        { /if }
      { /each }
    </div>
  { /if }

  { #if data.urlProductSlug }
    { #if products[0]?.similarProducts.length }
      <Title text="May also love" noBottom={ true }/>
      <div class="products">
        { #each products[0]?.similarProducts as p }
          <BriefProduct product={ p } />
        { /each }
      </div>
    { /if }

    <ProductCategories title="Store Categories" categories={ data.productCategories } currentCategorySlug={ data.urlCategorySlug } currentProductSlug={ data.urlProductSlug } />
  { /if }
{ /if }


<style lang="scss">
  .products {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
</style>
