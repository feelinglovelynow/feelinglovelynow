import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import { enumCacheKey } from '$lib/global/enums'
import { one } from '@feelinglovelynow/svelte-catch'
import { SvelteKV } from '@feelinglovelynow/svelte-kv'
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
