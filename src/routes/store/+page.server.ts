import type { Actions, PageServerLoad } from './$types'
import search from '$lib/actions/search'


export const load = (({ url }) => {
  return {
    urlProductSlug: url.searchParams.get('product'),
    urlCategorySlug: url.searchParams.get('category'),
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
