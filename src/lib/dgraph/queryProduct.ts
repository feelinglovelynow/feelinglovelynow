import type { Product } from '$lib'
import graphql from '$lib/dgraph/graphql'


export default async function getProducts (): Promise<Product[]> {
  const response = await graphql({
    query: `
      query MyQuery {
        queryProduct {
          id
          name
          price
          homeDisplayOrder
          storeDisplayOrder
          slug
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
            name
            slug
            price
            primaryImage {
              id
              extension
            }
          }
        }
      }
    `
  })

  return response?.data?.queryProduct || []
}
