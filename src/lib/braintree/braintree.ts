import { BRAINTREE_BASE_64 } from '$env/static/private'


export default async function braintree (body: string) {
  const url = 'https://payments.sandbox.braintree-api.com/graphql'

  const headers = {
    'Braintree-Version': '2023-10-14',
    'content-type': 'application/json',
    'Authorization': `Basic ${ BRAINTREE_BASE_64 }`
  }

  const fetchResponse = await fetch(url, { method: 'POST', headers, body })
  const jsonResponse = await fetchResponse.json()
  const response: { _errors: string[], data: any } = { _errors: [], data: {} }

  if (jsonResponse.errors?.length) response._errors = jsonResponse.errors.map((e: any) => { return e.message })
  else response.data = jsonResponse.data

  return response
}
