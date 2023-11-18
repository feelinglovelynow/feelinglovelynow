import put from '$lib/kv/put'
import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import type { RequestHandler } from './$types'
import { enumCacheKey } from '$lib/global/enums'
import queryProduct from '$lib/dgraph/queryProduct'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const GET = (async ({ locals }) => {
  try {
    if (!locals.userUid) throw one('Unauthorized', { locals })
    else {
      const products = await queryProduct()
      return json(await put(enumCacheKey.productsv2, JSON.stringify(products)))
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
