import { log } from './log'
import type { flnErrors } from './index.d'
import { json, redirect } from '@sveltejs/kit'
import { enumCatchLocation } from './enumCatchLocation'


export class SvelteCatch {
  defaultError: string
  location: enumCatchLocation

  constructor (location: enumCatchLocation, defaultError: string) {
    this.location = location
    this.defaultError = defaultError || 'We apologize, there is an error.'
  }

  catch (e: any) {
    return this.location === enumCatchLocation.pageServer ?
      this.#getCatchResponse(e) :
      json(this.#getCatchResponse(e), { status: 500 })
  }


  #getCatchResponse (e: any) {
    if (e?._redirect) throw redirect(302, e._redirect)
    else {
      let response: any | { _errors: flnErrors } = { _errors: [] }

      if (!e) response._errors.push(this.defaultError)
      else {
        if (typeof e === 'string') response._errors.push(e)
        else if (typeof e?.format === 'function') response = e.format()
        else if (Array.isArray(e?._errors)) response = e
        else if (e.message) response = { _errors: [ e.message ] }
        else response._errors.push(this.defaultError)
      }

      log({ e, response })
      return response
    }
  }
}
