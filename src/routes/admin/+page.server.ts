import search from '$lib/actions/search'
import imageAI from '$lib/actions/imageAI'
// import getProducts from '$lib/printful/getProducts'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async () => {
  try {
    // console.log(await getProducts())
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
  imageAI,
} satisfies Actions
