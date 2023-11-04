import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import type { RequestHandler } from './$types'
import type { SearchOrdersRequest } from '$lib'
import queryOrder from '$lib/dgraph/queryOrder'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const POST = (async ({ request }) => {
  try {
    if (PUBLIC_ENVIRONMENT !== 'local') throw one('Unauthorized', { PUBLIC_ENVIRONMENT })
    else {
      const body = await request.json() as SearchOrdersRequest
      return json(await queryOrder(body))
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
