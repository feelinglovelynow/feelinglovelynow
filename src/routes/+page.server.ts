import get from '$lib/kv/get'
import type { Product } from '$lib'
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
      products: await formatProducts(values[1])
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


async function formatProducts (products: any): Promise<Product[]> {
  if (!products?.length || !Array.isArray(products)) throw { _errors: [ 'No products found' ] }
  else {
    const featuredProducts: Product[] = []
    const featuredProductIds = [
      '0xfffd8d6ad3a1ade5', // How to Get High
      '0xfffd8d6ad3a1add5', // 100% Organic Cotton ⋅ Gold Flower of Life Embroidery ⋅ Women's T-Shirt ⋅ White
      '0xfffd8d6ad3a1d12f', // 100% Organic Cotton ⋅ Gold Lotus of Life Embroidery ⋅ Men's T-Shirt ⋅ Black
    ]

    for (const product of products) {
      if (featuredProductIds.includes(product.id)) {
        product.images[0].src = (await import(`../lib/img/store/${ product.images[0].id }.${ product.images[0].extension }`)).default
        featuredProducts.push(product)
      }

      if (featuredProducts.length === featuredProductIds.length) break
    }

    return [
      featuredProducts[1],
      featuredProducts[0],
      featuredProducts[2],
    ]
  }
}
