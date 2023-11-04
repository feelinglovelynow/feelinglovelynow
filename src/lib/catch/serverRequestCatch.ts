import { json } from '@sveltejs/kit'
import getCatchResponse from '$lib/catch/getCatchResponse'


export default function serverRequestCatch (e: any) {
  return json(getCatchResponse(e, 'We apologize, there is an error with this request, please try again and/or <a href="/links">contact us</a>'), { status: 500 })
}
