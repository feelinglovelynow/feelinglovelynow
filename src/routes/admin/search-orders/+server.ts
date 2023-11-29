import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { one } from '@feelinglovelynow/svelte-catch'
import queryOrder from '$lib/dgraph/queryOrder'
import { serverCatch } from '$lib/global/catch'
import type { SearchOrdersRequest } from '$lib'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userUid) throw one('Unauthorized', { locals })
    else {
      const body = await request.json() as SearchOrdersRequest
      return json(await queryOrder(null, true, body))
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
