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

  return response?.data?.queryProduct || []
}
