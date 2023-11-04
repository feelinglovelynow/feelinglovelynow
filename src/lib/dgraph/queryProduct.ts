import type { Product } from '$lib'
import dgraph from '$lib/dgraph/dgraph'


export default async function getProducts (): Promise<Product[]> {
  const { queryProduct } = await dgraph({
    query: `
      query MyQuery {
        queryProduct {
          id
          name
          price
          featuredDisplayOrder
          storeDisplayOrder
          slug
          description
          primaryImage {
            id
            extension
          }
          categories {
            name
            slug
          }
          similarProducts {
            id
          }
        }
      }
    `
  })

  return queryProduct as Product[]
}
