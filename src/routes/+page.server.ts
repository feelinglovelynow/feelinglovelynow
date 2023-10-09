import get from '$lib/kv/get'
import type { Category, Product } from '$lib'
import search from '$lib/actions/search'
import formatScience from '$lib/util/formatScience'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async ({ platform }) => {
  try {
    const values = await Promise.all([
      get('MAIN_CACHE', 'sources', platform),
      get('MAIN_CACHE', 'products', platform)
    ])

    return {
      ...formatSources(values[0]),
      ...(await formatProductsAndCategories(values[1]))
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
} satisfies Actions


function formatSources (sources: any) {
  if (!sources?.length || !Array.isArray(sources)) throw { _errors: [ 'No sources found' ] }
  else {
    let science, culture, product

    for (const source of sources) {
      if (!science && source.type === 'science') science = source
      else if (!culture && source.type === 'culture') culture = source
      else if (!product && source.type === 'product') product = source

      if (science && culture && product) break
    }

    return {
      culture,
      product,
      science: formatScience(science)
    }
  }
}


async function formatProductsAndCategories (products: Product[]): Promise<{ products: Product[], categories: Category[] }> {
  if (!products?.length || !Array.isArray(products)) throw { _errors: [ 'No products found' ] }
  else {
    const featuredProducts: Product[] = []
    const categories: Map<string, Category> = new Map()

    for (const product of products) {
      if (Number.isInteger(product.homeDisplayOrder)) {
        product.images[0].src = (await import(`../lib/img/store/${ product.images[0].id }.${ product.images[0].extension }`)).default
        featuredProducts.push(product)
      }

      for (const category of product.categories) {
        categories.set(category.slug, category) // categories at the top of the page
      }
    }

    return {
      categories: [...categories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)), // sort categories by name
      products: featuredProducts.sort((a, b) => Number(a.homeDisplayOrder > b.homeDisplayOrder) - Number(a.homeDisplayOrder < b.homeDisplayOrder)) // sort by storeDisplayOrder
    }
  }
}
