import put from '$lib/kv/put'
import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import type { RequestHandler } from './$types'
import queryProduct from '$lib/dgraph/queryProduct'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const GET = (async () => {
  try {
    if (PUBLIC_ENVIRONMENT !== 'local') throw one('Unauthorized', { PUBLIC_ENVIRONMENT })
    else {
      const products = await queryProduct()
      return json(await put('products', JSON.stringify(products)))
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
