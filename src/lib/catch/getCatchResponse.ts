import { ZodError } from 'zod'
import type { flnErrors } from '$lib'
import { redirect } from '@sveltejs/kit'
import _catch from '$lib/catch/getCatchResponse'


export default function getCatchResponse (e: any, DEFAULT_ERROR: string) {
  if (e?._redirect) throw redirect(302, e._redirect)
  else {
    let response: any | { _errors: flnErrors } = { _errors: [] }

    if (!e) response._errors.push(DEFAULT_ERROR)
    else {
      if (typeof e === 'string') response._errors.push(e)
      else if (e instanceof ZodError) response = e.format()
      else if (Array.isArray(e?._errors)) response = e
      else if (e.message) response = { _errors: [ e.message ] }
      else response._errors.push(DEFAULT_ERROR)
    }

    return response
  }
}
