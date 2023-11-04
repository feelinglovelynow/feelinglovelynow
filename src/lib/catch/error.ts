import type { flnErrors } from '$lib/catch/error.d'


export function one (message: string, errorData: any = undefined) {
  const _errors: flnErrors = [ message ]
  log(_errors, errorData)
  return { _errors }
}


export function many (_errors: flnErrors, errorData: any = undefined) {
  log(_errors, errorData)
  return { _errors }
}


function log (_errors: flnErrors, errorData: any = undefined) {
  console.log('---FLN ERROR START---')
  console.log({ _errors })
  if (errorData) console.log({ errorData })
  console.trace()
  console.log('---FLN ERROR END---')
}
