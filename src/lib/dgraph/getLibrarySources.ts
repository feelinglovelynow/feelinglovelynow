import type { Source } from '$lib'
import credentials from '$lib/dgraph/credentials'
import { DgraphTransaction } from '$lib/global/dgraph'


export default async function getLibrarySources (): Promise<Source[]> {
  const transaction = new DgraphTransaction({ ...credentials(true), readOnly: true }) // sources are only in main db

  const r = await transaction.query(true, `
    query {
      sources (func: type(Source), orderdesc: Source.createdAt) {
        uid
        type: Source.type
        title: Source.title
        slug: Source.slug
        url: Source.url
        urlType: Source.urlType
        description: Source.description
        createdAt: Source.createdAt
        publicationYear: Source.publicationYear
        publicationLocation: Source.publicationLocation
        images: Source.images {
          uid
          extension: Image.extension
        }
        quotes: Source.quotes {
          text: Quote.text
          displayOrder: Quote.displayOrder
          categories: Quote.categories {
            name: Category.name
            slug: Category.slug
          }
        }
        categories: Source.categories {
          name: Category.name
          slug: Category.slug
        }
        authors: Source.authors {
          name: Author.name
          slug: Author.slug
        }
      }
    }
  `)

  return r?.data?.sources as Source[]
}
