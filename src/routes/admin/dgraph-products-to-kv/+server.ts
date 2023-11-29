import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import { enumCacheKey } from '$lib/global/enums'
import queryProduct from '$lib/dgraph/queryProduct'
import { one } from '@feelinglovelynow/svelte-catch'
import { SvelteKV } from '@feelinglovelynow/svelte-kv'
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
