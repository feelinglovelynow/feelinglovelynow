import dgraph from '$lib/dgraph/dgraph'
import type { Category, SearchResponse, Source } from '$lib'



export default async function getSearchSources (search: string, isQuotesChecked: boolean, isSourcesByTitleChecked: boolean, isSourcesByDescriptionChecked: boolean): Promise<SearchResponse> {
  const sourcesByTitleQuery = !isSourcesByTitleChecked ? '' : `
    sourcesByTitle: querySource(filter: {title: {anyoftext: "${ search }"}}) {
      id
      type
      title
      slug
      url
      urlType
      description
      publicationYear
      publicationLocation
      authors(order: {asc: name}) {
        name
        slug
      }
    } 
  `
  const sourcesByDescriptionQuery = !isSourcesByDescriptionChecked ? '' : `
    sourcesByDescription: querySource(filter: {description: {anyoftext: "${ search }"}}) {
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
  `

  const quotesQuery = !isQuotesChecked ? '' : `
    quotes: queryQuote(filter: {text: {anyoftext: "${ search }"}}) {
      text
      displayOrder
      categories(order: {asc: name}) {
        name
        slug
      }
      source {
        id
        type
        title
        slug
        url
        urlType
        description
        publicationYear
        publicationLocation
        authors(order: {asc: name}) {
          name
          slug
        }
      }
    }
  `

  const { sourcesByTitle, sourcesByDescription, quotes } = await dgraph({
    query: `
      query MyQuery {
        ${ sourcesByTitleQuery }
        ${ sourcesByDescriptionQuery }
        ${ quotesQuery }
      }
    `
  })

  return {
    sourcesByTitle: (sourcesByTitle || []) as Source[],
    sourcesByDescription: (sourcesByDescription || []) as Source[],
    quotes: formatQuotes(quotes || []) as Source[],
  }
}


function formatQuotes (quotes: SearchQuotesByTextResponse): Source[] {
  let response: Source[] = []

  if (quotes.length) {
    response = quotes.map(r => {
      return {
        id: r.source.id,
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
            id: r.id,
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
  id: string
  text: string
  displayOrder: number
  categories: Category[]
  source: Source
}[]
