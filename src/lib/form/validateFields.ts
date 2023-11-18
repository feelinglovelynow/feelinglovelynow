import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { CLOUDFLARE_TURNSTILE_PRIVATE_KEY } from '$env/static/private'
import { validate, CLOUDFLARE_TURNSTILE_PRIVATE_KEY_ALWAYS_PASSES } from '@feelinglovelynow/svelte-turnstile'


export default async function (body: any, schema: any) {
  schema.parse(body)
  await validate(body['cf-turnstile-response'], (PUBLIC_ENVIRONMENT === 'local') ? CLOUDFLARE_TURNSTILE_PRIVATE_KEY_ALWAYS_PASSES : CLOUDFLARE_TURNSTILE_PRIVATE_KEY)
}
