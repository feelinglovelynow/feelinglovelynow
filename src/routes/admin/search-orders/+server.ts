import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import type { SearchOrdersRequest } from '$lib'
import { queryOrder } from '$lib/ace/queryOrder'
import { one } from '@feelinglovelynow/svelte-catch'


export const POST = (async ({ locals, request }) => {
  try {
    if (!locals.userId) throw one('Unauthorized', { locals })
    else {
      const body = await request.json() as SearchOrdersRequest
      return json(await queryOrder(body))
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
