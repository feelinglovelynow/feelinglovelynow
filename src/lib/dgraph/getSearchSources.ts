import credentials from '$lib/dgraph/credentials'
import { DgraphTransaction } from '$lib/global/dgraph'
import type { Category, SearchResponse, Source } from '$lib'


export default async function getSearchSources (search: string, isQuotesChecked: boolean, isSourcesByTitleChecked: boolean, isSourcesByDescriptionChecked: boolean): Promise<SearchResponse> {
  const sourcesByTitleQuery = !isSourcesByTitleChecked ? '' : `
    sourcesByTitle (func: anyoftext(Source.title, "${ search }")) @filter(type(Source))  {
      uid
      type: Source.type
      title: Source.title
      slug: Source.slug
      url: Source.url
      urlType: Source.urlType
      description: Source.description
      publicationYear: Source.publicationYear
      publicationLocation: Source.publicationLocation
      authors: Source.authors {
        name: Author.name
        slug: Author.slug
      }
    }
  `

  const sourcesByDescriptionQuery = !isSourcesByDescriptionChecked ? '' : `
    sourcesByDescription (func: anyoftext(Source.description, "${ search }")) @filter(type(Source))  {
      uid
      type: Source.type
      title: Source.title
      slug: Source.slug
      url: Source.url
      urlType: Source.urlType
      description: Source.description
      publicationYear: Source.publicationYear
      publicationLocation: Source.publicationLocation
      images: Product.images {
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
      categories: Source.categories(orderasc: Category.name) {
        name: Category.name
        slug: Category.slug
      }
      authors: Source.authors(orderasc: Author.name) {
        name: Author.name
        slug: Author.slug
      }
    }
  `

  const quotesQuery = !isQuotesChecked ? '' : `
    quotes (func: anyoftext(Quote.text, "${ search }")) @filter(type(Quote))  {
      uid
      text: Quote.text
      displayOrder: Quote.displayOrder
      categories: Quote.categories(orderasc: Category.name) {
        name: Category.name
        slug: Category.slug
      }
      source: Quote.source {
        uid
        type: Source.type
        title: Source.title
        slug: Source.slug
        url: Source.url
        urlType: Source.urlType
        description: Source.description
        publicationYear: Source.publicationYear
        publicationLocation: Source.publicationLocation
        authors: Quote.author(orderasc: Author.name) {
          name: Author.name
          slug: Author.slug
        }
      }
    }
  `

  const transaction = new DgraphTransaction({ ...credentials(true), readOnly: true,  bestEffort: true }) // sources are only in main db

  const r = await transaction.query(true, `
    query {
      ${ sourcesByTitleQuery }
      ${ sourcesByDescriptionQuery }
      ${ quotesQuery }
    }
  `)

  const sourcesByTitle = (r?.data?.sourcesByTitle || []) as Source[]
  const sourcesByDescription = (r?.data?.sourcesByDescription || []) as Source[]
  const quotes = formatQuotes(r?.data?.quotes || []) as Source[]

  return { sourcesByTitle, sourcesByDescription, quotes }
}


function formatQuotes (quotes: SearchQuotesByTextResponse): Source[] {
  let response: Source[] = []

  if (quotes.length) {
    response = quotes.map(r => {
      return {
        uid: r.source.uid,
        title: r.source.title,
        type: r.source.type,
        description: r.source.description,
        slug: r.source.slug,
        url: r.source.url,
        urlType: r.source.urlType,
        publicationLocation: r.source.publicationLocation,
        publicationYear: r.source.publicationYear,
        authors: r.source.authors,
        quotes: [
          {
            uid: r.uid,
            text: r.text,
            categories: r.categories,
            displayOrder: r.displayOrder
          }
        ]
      }
    })
  }

  return response
}


type SearchQuotesByTextResponse = {
  uid: string
  text: string
  displayOrder: number
  categories: Category[]
  source: Source
}[]
