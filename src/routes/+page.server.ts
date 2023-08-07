import get from '$lib/kv/get'
import search from '$lib/actions/search'
import routeCatch from '$lib/catch/routeCatch'
import type { Actions, PageServerLoad } from './$types'
import type { Source, Category } from '$lib/types/all'


export const load = (async ({ platform }) => {
  try {
    const sources = await get('MAIN_CACHE', 'sources', platform)
    return sourcesToResponse(sources)
  } catch (e) {
    return routeCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
} satisfies Actions


function sourcesToResponse (sources: any) {
  if (!sources?.length) return { error: 'No sources found' }
  else {
    let science, culture, product

    for (const source of sources) {
      if (!science && source.type === 'science') science = source
      else if (!culture && source.type === 'culture') culture = source
      else if (!product && source.type === 'product') product = source

      if (science && culture && product) break
    }

    return {
      culture,
      product,
      science: formatScience(science)
    }
  }
}


function formatScience (source?: Source): Source | undefined {
  if (source?.quotes) {
    const categoryMap = new Map<string, Category>()

    for (const quote of source.quotes) {
      for (const category of quote.categories) {
        categoryMap.set(category.slug, category)
      }
    }

    source.categories = [...categoryMap.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name))
  }

  return source
}
