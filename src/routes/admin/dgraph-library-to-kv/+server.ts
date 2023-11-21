import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { one } from '$lib/global/svelte-catch'
import { serverCatch } from '$lib/global/catch'
import { SvelteKV } from '$lib/global/svelte-kv'
import { enumCacheKey } from '$lib/global/enums'
import svelteKVOptions from '$lib/global/svelteKVOptions'
import getLibrarySources from '$lib/dgraph/getLibrarySources'


export const GET = (async ({ locals, platform }) => {
  try {
    if (!locals.userUid) throw one('Unauthorized', { locals })
    else {
      const sources = await getLibrarySources()
      const svelteKV = new SvelteKV({ ...svelteKVOptions, platform })
      return json(await svelteKV.put(enumCacheKey.sources, sources))
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
