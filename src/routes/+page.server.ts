import get from '$lib/kv/get'
import search from '$lib/actions/search'
import formatScience from '$lib/util/formatScience'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async ({ platform }) => {
  try {
    const sources = await get('MAIN_CACHE', 'sources', platform)
    return sourcesToResponse(sources)
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
} satisfies Actions


function sourcesToResponse (sources: any) {
  if (!sources?.length) throw { _errors: [ 'No sources found' ] }
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
