import { fail } from '@sveltejs/kit'
import getCatchResponse from '$lib/catch/getCatchResponse'


export default (e: any) => {
  console.error('ERROR @ $lib > catch > actionCatch.ts', e)
  return fail(400, getCatchResponse(e, 'We apologize, an error occurred with this form, please try again and/or <a href="/contact">contact us</a>'))
}
