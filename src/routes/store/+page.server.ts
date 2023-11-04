import search from '$lib/actions/search'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (({ url }) => {
  try {
    return {
      urlProductSlug: url.searchParams.get('product'),
      urlCategorySlug: url.searchParams.get('category'),
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
