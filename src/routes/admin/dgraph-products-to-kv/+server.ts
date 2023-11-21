import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { one } from '$lib/global/svelte-catch'
import { serverCatch } from '$lib/global/catch'
import { enumCacheKey } from '$lib/global/enums'
import { SvelteKV } from '$lib/global/svelte-kv'
import queryProduct from '$lib/dgraph/queryProduct'
import svelteKVOptions from '$lib/global/svelteKVOptions'


export const GET = (async ({ locals, platform }) => {
  try {
    if (!locals.userUid) throw one('Unauthorized', { locals })
    else {
      const products = await queryProduct()
      const svelteKV = new SvelteKV({ ...svelteKVOptions, platform })
      return json(await svelteKV.put(enumCacheKey.products, products))
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
