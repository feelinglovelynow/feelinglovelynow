<script lang="ts">
  import type { Product } from '$lib'
  import type { PageData } from './$types'
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

  const mapAllProducts: Map<string, Product> = new Map()

  $: if (data.products) bindProducts()


  function bindProducts () {
    if (!data.urlCategorySlug && !data.urlProductSlug) allProductsSelected()
    else if (data.urlCategorySlug) categorySelected()
    else productSelected()

    isPageLoading = false
  }


  function allProductsSelected () {
    products = sort(data.products) // all products

    if (mapAllProducts.size !== data.products.length) {
      setTimeout(() => { // only necessary for when the shopping cart is open so allow isPageLoading to toggle first so page shows swiftly
        for (const product of data.products) {
          mapAllProducts.set(product.id, product)
        }
      })
    }
  }


  function categorySelected () {
    const activeProducts: Map<string, Product> = new Map()

    for (const product of data.products) {
      if (mapAllProducts.size !== data.products.length) mapAllProducts.set(product.id, product)

      for (const category of product.categories) {        
        if (data.urlCategorySlug === category.slug) activeProducts.set(product.id, product)
      }
    }

    products = sort([...activeProducts.values()])
  }


  function productSelected () {
    for (const product of data.products) {
      if (mapAllProducts.size !== data.products.length) mapAllProducts.set(product.id, product)
      if (data.urlProductSlug === product.slug) products = [ product ]
    }

    for (const product of products[0].similarProducts) {
      const pFromAll = mapAllProducts.get(product.id)

      if (pFromAll) {
        product.name = pFromAll.name
        product.slug = pFromAll.slug
        product.price = pFromAll.price
        product.primaryImage = pFromAll.primaryImage
      }
    }
  }


  function sort (products: Product[]) {
    return products.sort((a, b) => Number(a.storeDisplayOrder > b.storeDisplayOrder) - Number(a.storeDisplayOrder < b.storeDisplayOrder)) // sort products by storeDisplayOrder
  }
</script>


<main>
  { #if data.urlProductSlug && products?.length }
    <Head title={ products[0].name } ogImageSrc={ products[0].primaryImage.src } description={ products[0].name } />
  { :else }
    <Head title="Store" ogImageSrc={ IMG_OG_STORE } description="Organic t-shirts and books available for purchase!" />
  { /if }


  { #if isPageLoading }
  <SimpleLoader />
  { :else }
    <ShoppingCart { mapAllProducts } />
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
      { #if products[0].similarProducts.length }
        <Title text="May also love" noBottom={ true }/>
        <div class="products">
          { #each products[0].similarProducts as p }
            <BriefProduct product={ p } />
          { /each }
        </div>
      { /if }

      <ProductCategories title="Store Categories" categories={ data.productCategories } currentCategorySlug={ data.urlCategorySlug } currentProductSlug={ data.urlProductSlug } />
    { /if }
  { /if }
</main>


<style lang="scss">
  .products {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
</style>
