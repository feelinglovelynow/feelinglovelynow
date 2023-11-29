import { one } from '@feelinglovelynow/svelte-catch'
import _publicPaypalCredentials from '$lib/store/publicPaypalCredentials'
import _privatePaypalCredentials from '$lib/store/privatePaypalCredentials'
import type { PublicPaypalCredentials, PrivatePaypalCredentials } from '$lib'


export default async function apiPaypal (url: string, body: any = undefined) {
  const publicPaypalCredentials = _publicPaypalCredentials()
  const privatePaypalCredentials = _privatePaypalCredentials()
  const token = await getApiPaypalAccessToken(publicPaypalCredentials, privatePaypalCredentials)

  const init: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ token }`
    }
  }

  if (body) init.body = JSON.stringify(body)

  const rFetch = await fetch(`${ privatePaypalCredentials.apiUrl }/${ url }`, init)
  const r = await rFetch.json()

  if (r?.error_description) throw one(r.error_description, { url, body, status: rFetch.status, r })
  else if (rFetch.status > 201 && r.message) throw one(r.message, { url, body, status: rFetch.status, r })
  else return { response: r, status: rFetch.status }
}


async function getApiPaypalAccessToken (publicPaypalCredentials: PublicPaypalCredentials, privatePaypalCredentials: PrivatePaypalCredentials): Promise<string> {
  const fetchUrl = `${ privatePaypalCredentials.apiUrl }/v1/oauth2/token`
  const auth = btoa(`${ publicPaypalCredentials.clientId }:${ privatePaypalCredentials.clientSecret }`)

  const init: RequestInit = {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${ auth }`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const rFetch = await fetch(fetchUrl, init)
  const { access_token } = await rFetch.json()

  return access_token
}
