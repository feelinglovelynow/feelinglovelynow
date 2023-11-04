import { one } from '$lib/catch/error'
import { PAYPAL_SANDBOX_API_URL, PAYPAL_SANDBOX_SECRET } from '$env/static/private'
import { PUBLIC_ENVIRONMENT, PUBLIC_PAYPAL_SANDBOX_CLIENT_ID } from '$env/static/public'


const apiUrl = PUBLIC_ENVIRONMENT === 'local' ? PAYPAL_SANDBOX_API_URL : PAYPAL_SANDBOX_API_URL
const clientId = PUBLIC_ENVIRONMENT === 'local' ? PUBLIC_PAYPAL_SANDBOX_CLIENT_ID : PUBLIC_PAYPAL_SANDBOX_CLIENT_ID
const clientSecret = PUBLIC_ENVIRONMENT === 'local' ? PAYPAL_SANDBOX_SECRET : PAYPAL_SANDBOX_SECRET


export async function apiPaypal (url: string, body: any = undefined) {
  const fetchUrl = `${ PAYPAL_SANDBOX_API_URL }/${ url }`
  const accessToken = await apiPaypalAccessToken()

  const init: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ accessToken }`
    }
  }

  if (body) init.body = JSON.stringify(body)

  const rFetch = await fetch(fetchUrl, init)
  const r = await rFetch.json()

  if (r?.error_description) throw one(r.error_description, { url, body, status: rFetch.status, r })
  else if (rFetch.status > 201 && r.message) throw one(r.message, { url, body, status: rFetch.status, r })
  else {
    return {
      response: r,
      status: rFetch.status
    }
  }
}


export async function apiPaypalAccessToken (): Promise<string> {
  const fetchUrl = `${ apiUrl }/v1/oauth2/token`
  const auth = btoa(`${ clientId }:${ clientSecret }`)

  const init: RequestInit = {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${ auth }`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const fetcResponse = await fetch(fetchUrl, init)
  const { access_token } = await fetcResponse.json()

  return access_token
}
