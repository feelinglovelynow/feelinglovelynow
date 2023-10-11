import get from '$lib/kv/get'
import search from '$lib/actions/search'
import type { Product, Category } from '$lib'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async ({ url, platform }) => {
  try {
    const products: Map<string, Product> = new Map()
    const categories: Map<string, Category> = new Map()
    const urlProductSlug = url.searchParams.get('product')
    const urlCategorySlug = url.searchParams.get('category')
    const kvProducts = await get('MAIN_CACHE', 'products', platform)


    for (const product of kvProducts) {
      if (!urlProductSlug || urlProductSlug === product.slug) product.images[0].src = (await import(`../../lib/img/store/${ product.images[0].id }.${ product.images[0].extension }`)).default

      for (const category of product.categories) {
        categories.set(category.slug, category) // categories at the top of the page
        
        if ((!urlCategorySlug || urlCategorySlug === category.slug) && (!urlProductSlug || urlProductSlug === product.slug)) products.set(product.id, product)
      }
    }

    const arrayProducts = [...products.values()]
    const arrayCategories = [...categories.values()]

    return {
      urlProductSlug,
      urlCategorySlug,
      categories: !arrayCategories.length ? [] : [...categories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)), // sort categories by name
      products: !arrayProducts.length ? [] : [...products.values()].sort((a, b) => Number(a.storeDisplayOrder > b.storeDisplayOrder) - Number(a.storeDisplayOrder < b.storeDisplayOrder)), // sort products by storeDisplayOrder
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
