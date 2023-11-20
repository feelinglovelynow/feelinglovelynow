import type { PrivatePaypalCredentials } from '$lib'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { PAYPAL_API_URL, PAYPAL_SECRET, PAYPAL_SANDBOX_API_URL, PAYPAL_SANDBOX_SECRET } from '$env/static/private'

export default function privatePaypalCredentials (): PrivatePaypalCredentials {
  return PUBLIC_ENVIRONMENT === 'main' ?
    { apiUrl: PAYPAL_API_URL, clientSecret: PAYPAL_SECRET } :
    { apiUrl: PAYPAL_SANDBOX_API_URL, clientSecret: PAYPAL_SANDBOX_SECRET}
}
