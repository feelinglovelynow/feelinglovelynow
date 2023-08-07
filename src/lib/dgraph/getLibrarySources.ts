import graphql from '$lib/dgraph/graphql'
import type { Source } from '$lib/types/all'


export default async function getLibrarySources (): Promise<Source[] | undefined> {
  const response = await graphql({
    query: `
      query MyQuery {
        sources: querySource(order: {desc: createdAt}) {
          id
          type
          title
          slug
          url
          urlType
          description
          publicationYear
          publicationLocation
          images {
            id
          }
          quotes {
            text
            displayOrder
            categories {
              name
              slug
            }
          }
          categories(order: {asc: name}) {
            name
            slug
          }
          authors(order: {asc: name}) {
            name
            slug
          }
        }
      }
    `
  })

  return response?.data?.sources
}
