import search from '$lib/actions/search'
import graphql from '$lib/dgraph/graphql'
import type { Product, Category } from '$lib'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async () => {
  try {
    const response = await graphql({
      query: `
        query MyQuery {
          queryProduct(order: {asc: displayOrder}) {
            id
            name
            displayOrder
            slug
            categories {
              name
              slug
            }
            images(order: {asc: displayOrder}) {
              id
              displayOrder
              extension
            }
          }
        }
      `
    })


    let images = []
    const products: Product[] = response?.data?.queryProduct || []
    const categories: Map<string, Category> = new Map() // use map so duplicates are removed   


    for (const product of products) {
      for (const image of product.images) {
        images.push(image)
      }

      for (const category of product.categories) {
        categories.set(category.slug, category)
      }
    }


    const imageResponse = await Promise.all(images.map((image) => import(`../../lib/img/store/${ image.id }.${ image.extension }`)))

    let imageResponseIndex = 0

    for (const product of products) {
      for (const image of product.images) {
        image.src = imageResponse[imageResponseIndex].default
        imageResponseIndex++
      }
    }

    return {
      products,
      categories: [...categories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)), // sort categories by name
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
