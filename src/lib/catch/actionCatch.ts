import { fail } from '@sveltejs/kit'
import getCatchResponse from '$lib/catch/getCatchResponse'


export default function actionCatch (e: any) {
  return fail(400, getCatchResponse(e, 'We apologize, an error occurred with this form, please try again and/or <a href="/links">contact us</a>'))
}
