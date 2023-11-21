import type { PageServerLoad } from './$types'
import { pageServerCatch } from '$lib/global/catch'


export const load = (({ url }) => {
  try {
    return {
      urlProductSlug: url.searchParams.get('product'),
      urlCategorySlug: url.searchParams.get('category'),
    }
  } catch (e) {
    return pageServerCatch(e)
  }
}) satisfies PageServerLoad
