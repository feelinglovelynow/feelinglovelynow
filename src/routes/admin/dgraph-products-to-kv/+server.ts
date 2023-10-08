import put from '$lib/kv/put'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import getProducts from '$lib/dgraph/getProducts'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const GET = (async () => {
  try {
    if (PUBLIC_ENVIRONMENT !== 'local') return json({ error: 'Unauthorized' })
    else {
      const products = await getProducts()
      return json(await put('products', JSON.stringify(products)))
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
