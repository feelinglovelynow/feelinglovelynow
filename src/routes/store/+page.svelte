<script lang="ts">
  import type { Product } from '$lib'
  import type { PageData } from './$types'
  import Head from '$lib/global/Head.svelte'
  import Title from '$lib/global/Title.svelte'
  import { routeCatch } from '$lib/global/catch'
  import FullProduct from '$lib/store/FullProduct.svelte'
  import IMG_OG_STORE from '$lib/img/og/IMG_OG_STORE.webp'
  import ShoppingCart from '$lib/store/ShoppingCart.svelte'
  import BriefProduct from '$lib/store/BriefProduct.svelte'
  import ProductCategories from '$lib/store/ProductCategories.svelte'

  export let data: PageData
  routeCatch(data)

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
          mapAllProducts.set(product.uid, product)
        }
      })
    }
  }


  function categorySelected () {
    const activeProducts: Map<string, Product> = new Map()

    for (const product of data.products) {
      if (mapAllProducts.size !== data.products.length) mapAllProducts.set(product.uid, product)

      for (const category of product.categories) {        
        if (data.urlCategorySlug === category.slug) activeProducts.set(product.uid, product)
      }
    }

    products = sort([...activeProducts.values()])
  }


  function productSelected () {
    for (const product of data.products) {
      if (mapAllProducts.size !== data.products.length) mapAllProducts.set(product.uid, product)
      if (data.urlProductSlug === product.slug) products = [ product ]
    }

    for (const product of products[0].similarProducts) {
      const pFromAll = mapAllProducts.get(product.uid)

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
    <div class="fln__circle-load"></div>
  { :else }
    <ShoppingCart { mapAllProducts } />
    <Title text="Store" size="one" />

    { #if !data.urlProductSlug }
      <ProductCategories categories={ data.productCategories } currentCategorySlug={ data.urlCategorySlug } />
    { /if }

    { #if products?.length }
      <div class="products">
        { #each products as product (product.uid) }
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
          { #each products[0].similarProducts as p (p.slug) }
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
