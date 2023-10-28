import get from '$lib/kv/get'
import type { LayoutServerLoad } from './$types'
import type { Source, Product, Category } from '$lib'


export const load = (async ({ locals, platform }) => {
  const [ sources, products ] = await Promise.all([
    get('MAIN_CACHE', 'sources', platform),
    get('MAIN_CACHE', 'products', platform)
  ])

  const mapCategories: Map<string, Category> = new Map()

  const primaryImages = await Promise.all(products.map((product: Product) => {
    return import(`../lib/img/store/${ product.primaryImage.id }.${ product.primaryImage.extension }`)
  }))

  for (let i = 0; i < products.length; i++) {
    products[i].primaryImage.src = primaryImages[i].default

    for (const category of products[i].categories) {
      mapCategories.set(category.slug, category) // categories at the top of the page
    }
  }

  return {
    locals,
    sources: sources as Source[],
    products: products as Product[],
    productCategories: [...mapCategories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)) // sort categories by name
  }
}) satisfies LayoutServerLoad
