import { one } from '$lib/catch/error'
import { PUBLIC_ENVIRONMENT, PUBLIC_PAYPAL_CLIENT_ID, PUBLIC_PAYPAL_SANDBOX_CLIENT_ID } from '$env/static/public'
import { PAYPAL_API_URL, PAYPAL_SECRET, PAYPAL_SANDBOX_API_URL, PAYPAL_SANDBOX_SECRET } from '$env/static/private'


export default async function apiPaypal (url: string, body: any = undefined) {
  const apiUrl = PUBLIC_ENVIRONMENT === 'main' ? PAYPAL_API_URL: PAYPAL_SANDBOX_API_URL
  const accessToken = await apiPaypalAccessToken(apiUrl)
  const fetchUrl = `${ apiUrl }/${ url }`

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


async function apiPaypalAccessToken (apiUrl: string): Promise<string> {
  const fetchUrl = `${ apiUrl }/v1/oauth2/token`
  const clientSecret = PUBLIC_ENVIRONMENT === 'main' ? PAYPAL_SECRET : PAYPAL_SANDBOX_SECRET
  const clientId = PUBLIC_ENVIRONMENT === 'main' ? PUBLIC_PAYPAL_CLIENT_ID : PUBLIC_PAYPAL_SANDBOX_CLIENT_ID
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
