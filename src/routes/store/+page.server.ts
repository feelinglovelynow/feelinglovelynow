import get from '$lib/kv/get'
import search from '$lib/actions/search'
import type { Product, Category } from '$lib'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async ({ url, platform }) => {
  try {
    let activeCategorySlug: string = ''
    const products: Map<string, Product> = new Map()
    const categories: Map<string, Category> = new Map()
    const urlProduct = url.searchParams.get('product')
    const urlCategory = url.searchParams.get('category')
    const kvProducts = await get('MAIN_CACHE', 'products', platform)


    for (const product of kvProducts) {
      if (!urlProduct || urlProduct === product.slug) {
        product.images[0].src = (await import(`../../lib/img/store/${ product.images[0].id }.${ product.images[0].extension }`)).default

        for (const category of product.categories) {
          categories.set(category.slug, category) // categories at the top of the page

          if (!urlCategory || urlCategory === category.slug) { // if no specific category is requested in the url OR if one is and this product has this category => show product
            products.set(product.id, product)
            if (urlCategory === category.slug) activeCategorySlug = category.slug
          }
        }

        if (urlProduct === product.slug) break
      }
    }


    return {
      activeCategorySlug,
      activeProductSlug: urlProduct,
      products: [...products.values()].sort((a, b) => Number(a.displayOrder > b.displayOrder) - Number(a.displayOrder < b.displayOrder)), // sort categories by name
      categories: [...categories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)), // sort categories by name
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
