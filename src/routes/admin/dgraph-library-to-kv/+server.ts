import put from '$lib/kv/put'
import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import type { RequestHandler } from './$types'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import getLibrarySources from '$lib/dgraph/getLibrarySources'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const GET = (async () => {
  try {
    if (PUBLIC_ENVIRONMENT !== 'local') throw one('Unauthorized', { PUBLIC_ENVIRONMENT })
    else {
      const sources = await getLibrarySources()
      return json(await put('sources', JSON.stringify(sources)))
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
