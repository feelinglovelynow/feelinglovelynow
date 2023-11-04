import type { Source } from '$lib'
import dgraph from '$lib/dgraph/dgraph'


export default async function getLibrarySources (): Promise<Source[]> {
  const { sources } = await dgraph({
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
            extension
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

  return sources as Source[]
}
