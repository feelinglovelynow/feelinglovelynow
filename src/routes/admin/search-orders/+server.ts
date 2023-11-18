import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import type { RequestHandler } from './$types'
import type { SearchOrdersRequest } from '$lib'
import queryOrder from '$lib/dgraph/queryOrder'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userUid) throw one('Unauthorized', { locals })
    else {
      const body = await request.json() as SearchOrdersRequest
      return json(await queryOrder(null, body))
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
