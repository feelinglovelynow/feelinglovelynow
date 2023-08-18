import get from '$lib/kv/get'
import search from '$lib/actions/search'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import loopBackwards from '@sensethenlove/loop-backwards'
import type { Source, SourceType, Author, Category, Quote } from '$lib'


export const load = (async ({ request, platform }) => {
  try {
    const url = getUrl(request)
    const sources = await get('MAIN_CACHE', 'sources', platform)

    return sourcesToResponse(url, sources)
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions


function getUrl (request: Request): CurrentURL {
  const url = new URL(request.url) // get current url this way to avoid this bug https://github.com/sveltejs/kit/issues/9390

  return {
    type: getUrlParamType(url),
    author: url.searchParams.get('author'),
    category: url.searchParams.get('category'),
    count: Number(url.searchParams.get('count')) || 6,
  }
}


function getUrlParamType (url: URL): SourceType {
  const type = url.searchParams.get('type')
  return (type === 'science' || type === 'product' || type === 'culture') ? type : undefined
}


function sourcesToResponse (url: CurrentURL, sources: Source[] | undefined) {
  const authors: Map<string, Author> = new Map() // use map so duplicates are removed
  const categories: Map<string, Category> = new Map() // use map so duplicates are removed    
  let responseAuthor: Author | undefined // if there is an author slug in the url we'll respond w/ the full author object in this property
  let responseCategory: Category | undefined // if there is an category slug in the url we'll respond w/ the full category object in this property

  if (sources?.length) {
    loopBackwards(sources, (source, spliceSource) => {
      let sourceIsValid = true
      let urlAuthorWroteSource = false

      if (source?.authors) {
        for (const author of source.authors) {
          authors.set(author.slug, author) // place each author in map

          if (url.author && author.slug === url.author) { // if an author param is requested in the URL AND the author in the loop matches the urlAuthorSlug
            responseAuthor = author
            urlAuthorWroteSource = true
          }
        }
      }

      if (source.type === 'science') {
        if (source.quotes) {
          let sourceCategories: Map<string, Category> = new Map() // use map so duplicates are removed

          loopBackwards(source.quotes, (quote, spliceQuote) => {          
            let quoteHasUrlCategory = false

            if (quote.categories) {
              for (const category of quote.categories) {
                categories.set(category.slug, category) // place each category in map of all categories

                if (!url.category) addCategoriesToSourceCategories(quote, sourceCategories) // if no category is requested in the url => place categories from quote into source categories
                else if (category.slug === url.category) { // if a category param is requested in the URL AND the category in the loop matches the urlCategorySlug
                  responseCategory = category // save this full variable representing the url slug as an object filled w/ properties
                  quoteHasUrlCategory = true // tip flag indicating quote from url found
                  addCategoriesToSourceCategories(quote, sourceCategories) // place categories from quote into source categories
                }
              }
            }

            if (url.category && !quoteHasUrlCategory) spliceQuote() // if a category param is requested in the URL AND this quote does not in the requested category => remove quote from source
            else source.categories = [...sourceCategories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)) // source is valid => set source categories AND sort them by name
          })
        }
      } else { // culture || product
        let sourceHasUrlCategory = false

        if (source.categories) {
          for (const category of source.categories) {
            categories.set(category.slug, category) // place each category in map of all categories

            if (category.slug === url.category) { // category in source matches category in URL
              sourceHasUrlCategory = true // tip flag
              responseCategory = category // save this full variable representing the url slug as an object filled w/ properties
            }
          }

          if (url.category && !sourceHasUrlCategory) sourceIsValid = false // if a category param is requested in the URL AND category in url is not in this source => tip remove source flag
          else source.categories.sort((a: Category, b: Category) => Number(a.name > b.name) - Number(a.name < b.name)) // sort categories by name
        } else if (url.category) { // if a category param is requested in the URL AND source has no categories => tip remove source flag
          sourceIsValid = false
        }
      }

      if (!sourceIsValid) spliceSource() // if splice source requested => remove source
      else if (url.type && url.type !== source.type) spliceSource() // if source type is requested in the URL AND this source is not in that type => remove source
      else if (url.author && !urlAuthorWroteSource) spliceSource() // if an author param is requested in the URL AND this source was not written by this author => remove source
      else if (source.type === 'science' && !source.quotes?.length) spliceSource() // if science source has no quotes => remove source
      else if (source.type === 'science') source.quotes?.sort((a: Quote, b: Quote) => a.displayOrder - b.displayOrder) // sorce is valid AND it is a science source => sort quotes by displayOrder      
    })
  }

  return {
    type: url.type,
    count: url.count,
    author: responseAuthor,
    category: responseCategory,
    sources: sources?.slice(0, url.count),
    authors: [...authors.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)), // sort authors by name
    categories: [...categories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)), // sort categories by name
  }
}


function addCategoriesToSourceCategories (quote: Quote, sourceCategories: Map<string, Category>) {
  if (quote.categories) {
    for (const category of quote.categories) {
      sourceCategories.set(category.slug, category)
    }
  }
}


type CurrentURL = {
  type?: SourceType
  count: number
  author: string | null
  category: string | null
}
