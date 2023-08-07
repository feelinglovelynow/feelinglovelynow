import search from '$lib/actions/search'
import getSource from '$lib/dgraph/getSource'
import routeCatch from '$lib/catch/routeCatch'
import type { Actions, PageServerLoad } from './$types'


export const load = (async ({ params }) => {
  try {
    return {
      source: await getSource(params.slug)
    }
  } catch (e) {
    return routeCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
} satisfies Actions
