import get from '$lib/kv/get'
import search from '$lib/actions/search'
import type { Product, Category } from '$lib'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async ({ url, platform }) => {
  try {
    const mapAllProducts: Map<string, Product> = new Map()
    const activeProducts: Map<string, Product> = new Map()
    const categories: Map<string, Category> = new Map()
    const urlProductSlug = url.searchParams.get('product')
    const urlCategorySlug = url.searchParams.get('category')
    const kvProducts = await get('MAIN_CACHE', 'products', platform) as Product[]


    for (const product of kvProducts) {
      product.primaryImage.src = (await import(`../../lib/img/store/${ product.primaryImage.id }.${ product.primaryImage.extension }`)).default
      mapAllProducts.set(product.id, product)

      for (const category of product.categories) {
        categories.set(category.slug, category) // categories at the top of the page
        
        if ((!urlCategorySlug || urlCategorySlug === category.slug) && (!urlProductSlug || urlProductSlug === product.slug)) activeProducts.set(product.id, product)
      }
    }

    const arrayProducts = [...activeProducts.values()]
    const arrayCategories = [...categories.values()]
    const allProducts = [...mapAllProducts.values()]

    if (urlProductSlug && arrayProducts.length === 1) { // get data about similarProducts
      for (const [ i, similarProduct ] of arrayProducts[0].similarProducts.entries()) { // loop the similarProducts (only gives the product id's)
        const similarProductFromAll = mapAllProducts.get(similarProduct.id) // get all the data about this similar product 

        if (similarProductFromAll) {
          similarProductFromAll.primaryImage.src = (await import(`../../lib/img/store/${ similarProductFromAll.primaryImage.id }.${ similarProductFromAll.primaryImage.extension }`)).default

          arrayProducts[0].similarProducts[i] = { // sync all data w/ similar product data
            ...similarProduct,
            ...similarProductFromAll
          }
        }
      }
    }

    return {
      allProducts,
      urlProductSlug,
      urlCategorySlug,
      categories: !arrayCategories.length ? [] : [...categories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)), // sort categories by name
      products: !arrayProducts.length ? [] : [...activeProducts.values()].sort((a, b) => Number(a.storeDisplayOrder > b.storeDisplayOrder) - Number(a.storeDisplayOrder < b.storeDisplayOrder)), // sort products by storeDisplayOrder
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
