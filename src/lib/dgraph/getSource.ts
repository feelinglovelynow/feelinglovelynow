import graphql from '$lib/dgraph/graphql'
import type { Source } from '$lib/types/all'


export default async function getSource (slug: string): Promise<Source | null> {
  const response = await graphql({
    query: `
      query MyQuery {
        source: getSource(slug: "${ slug }") {
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
            categories(order: {asc: name}) {
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

  return response?.data?.source
}
