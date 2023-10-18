import { json } from '@sveltejs/kit'
import { PAYPAL_SANDBOX_ACCESS, PAYPAL_SANDBOX_API_URL } from '$env/static/private'


export default async function createPaypalOrder (url: string, body: any = undefined) {
  const fetchUrl = `${ PAYPAL_SANDBOX_API_URL }/${ url }`

  const init: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ PAYPAL_SANDBOX_ACCESS }`
    }
  }

  if (body) init.body = JSON.stringify(body)

  const fetcResponse = await fetch(fetchUrl, init)
  const response = await fetcResponse.json()

  if (response?.error_description) {
    console.log('paypal error', fetcResponse.status, response, url, body)
    throw { _errors: [ response.error_description ] }
  } else if (fetcResponse.status !== 200 && fetcResponse.status !== 201 && response.message) {
    console.log('paypal error', fetcResponse.status, response, url, body)
    throw { _errors: [ response.message ] }
  } else return json(response, { status: fetcResponse.status })
}
