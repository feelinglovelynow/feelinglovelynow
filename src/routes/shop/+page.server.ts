import search from '$lib/actions/search'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { PRINTFUL_API_TOKEN } from '$env/static/private'


export const load = (async () => {
  try {
    const fetchResponse = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ PRINTFUL_API_TOKEN }`,
      }
    })

    const response = await fetchResponse.json()
    console.log(response)
    return { response }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
