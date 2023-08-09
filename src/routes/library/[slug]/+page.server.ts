import get from '$lib/kv/get'
import search from '$lib/actions/search'
import formatScience from '$lib/util/formatScience'
import serverPageCatch from '$lib/catch/serverPageCatch'
import type { Actions, PageServerLoad, RouteParams } from './$types'


export const load = (async ({ params, platform }) => {
  try {
    const sources = await get('MAIN_CACHE', 'sources', platform)
    const source = sourcesToResponse(sources, params)
    return { source }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
} satisfies Actions


function sourcesToResponse (sources: any, params: RouteParams) {
  if (!sources?.length) throw { _errors: [ 'No sources found' ] }
  else {
    for (const source of sources) {
      if (source.slug === params.slug) return formatScience(source)
    }
  }
}
