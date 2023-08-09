import { json } from '@sveltejs/kit'
import getCatchResponse from '$lib/catch/getCatchResponse'


export default function serverRequestCatch (e: any) {
  console.error('ERROR @ $lib > catch > serverRequestCatch.ts', e)
  return json(getCatchResponse(e, 'We apologize, there is an error with this request, please try again and/or <a href="/contact">contact us</a>'), { status: 500 })
}
