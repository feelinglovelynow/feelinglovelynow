import type { Product } from '$lib'
import search from '$lib/actions/search'
import graphql from '$lib/dgraph/graphql'
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

    for (const product of products) {
      for (const image of product.images) {
        images.push(image)
      }
    }


    const imageResponse = await Promise.all(images.map((image) => import(`../../lib/img/products/${ image.id }.${ image.extension }`)))

    let imageResponseIndex = 0

    for (const product of products) {
      for (const image of product.images) {
        image.src = imageResponse[imageResponseIndex].default
        imageResponseIndex++
      }
    }

    return { products }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
