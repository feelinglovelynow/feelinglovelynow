import _log from '$lib/global/log'
import type { flnErrors } from '$lib/catch/error.d'


export function one (message: string, errorData: any = undefined) {
  const _errors: flnErrors = [ message ]
  log({ _errors, errorData })
  return { _errors }
}


export function many (_errors: flnErrors, errorData: any = undefined) {
  log({ _errors, errorData })
  return { _errors }
}


export function redirect (url: string) {
  return { _redirect: url }
}


export function log (data: any) {
  _log([ '---FLN ERROR START---', data, 'trace',  '---FLN ERROR END---' ])
}
