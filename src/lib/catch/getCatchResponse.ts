import { ZodError } from 'zod'
import type { flnErrors } from '$lib'
import _catch from '$lib/catch/getCatchResponse'


export default function getCatchResponse (e: any, DEFAULT_ERROR: string) {
  let response: any | { _errors: flnErrors } = { _errors: [] }

  if (!e) response._errors.push(DEFAULT_ERROR)
  else {
    if (typeof e === 'string') response._errors.push(e)
    else if (e instanceof ZodError) response = e.format()
    else if (Array.isArray(e?._errors)) response = e
    else if (e instanceof Error && e.message) response = { _errors: [ e.message ] }
    else response._errors.push(DEFAULT_ERROR)
  }

  return response
}
