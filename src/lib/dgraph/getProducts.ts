import type { Product } from '$lib'
import graphql from '$lib/dgraph/graphql'


export default async function getProducts (): Promise<Product[]> {
  const response = await graphql({
    query: `
      query MyQuery {
        queryProduct(order: {asc: displayOrder}) {
          id
          name
          price
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

  return response?.data?.queryProduct || []
}
