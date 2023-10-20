import { PUBLIC_ENVIRONMENT, PUBLIC_PAYPAL_SANDBOX_CLIENT_ID } from '$env/static/public'
import { PAYPAL_SANDBOX_API_URL, PAYPAL_SANDBOX_SECRET } from '$env/static/private'


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

  const fetcResponse = await fetch(fetchUrl, init)
  const response = await fetcResponse.json()

  if (response?.error_description) {
    console.log('paypal error', fetcResponse.status, response, url, body)
    throw { _errors: [ response.error_description ] }
  } else if (fetcResponse.status !== 200 && fetcResponse.status !== 201 && response.message) {
    console.log('paypal error', fetcResponse.status, response, url, body)
    throw { _errors: [ response.message ] }
  } else {
    return {
      response,
      status: fetcResponse.status
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
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${ auth }`
    }
  }

  const fetcResponse = await fetch(fetchUrl, init)
  const { access_token } = await fetcResponse.json()

  return access_token
}
