import { json } from '@sveltejs/kit'
import apiPaypal from '$lib/store/apiPaypal'
import type { RequestHandler } from './$types'
import type { CaptureOrderRequest } from '$lib'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const POST = (async ({ request }) => {
  try {
    const body = await request.json() as CaptureOrderRequest

    if (!body?.orderId) return json({ _errors: [ 'Order id in request is required' ] }, { status: 400 })
    else return apiPaypal(`v2/checkout/orders/${ body.orderId }/capture`)
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
