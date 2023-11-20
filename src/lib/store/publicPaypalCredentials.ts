import type { PublicPaypalCredentials } from '$lib'
import { PUBLIC_ENVIRONMENT, PUBLIC_PAYPAL_CLIENT_ID, PUBLIC_PAYPAL_SANDBOX_CLIENT_ID } from '$env/static/public'

export default function publicPaypalCredentials (): PublicPaypalCredentials {
  return PUBLIC_ENVIRONMENT === 'main' ?
    { clientId: PUBLIC_PAYPAL_CLIENT_ID } :
    { clientId: PUBLIC_PAYPAL_SANDBOX_CLIENT_ID }
}
