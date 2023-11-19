import put from '$lib/kv/put'
import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import type { RequestHandler } from './$types'
import { enumCacheKey } from '$lib/global/enums'
import getLibrarySources from '$lib/dgraph/getLibrarySources'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const GET = (async ({ locals }) => {
  try {
    if (!locals.userUid) throw one('Unauthorized', { locals })
    else {
      const sources = await getLibrarySources()
      return json(await put(enumCacheKey.sources, JSON.stringify(sources)))
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
