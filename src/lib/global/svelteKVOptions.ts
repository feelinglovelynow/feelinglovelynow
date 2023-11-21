import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { enumSvelteKVPoint } from '$lib/global/svelte-kv'
import { CLOUDFLARE_KV_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID } from '$env/static/private'

export default {
  doJSONParse: true,
  doJSONStringify: true,
  accountId: CLOUDFLARE_ACCOUNT_ID,
  apiToken: CLOUDFLARE_KV_API_TOKEN,
  namespace: 'CACHE',
  namespaceId: CLOUDFLARE_KV_NAMESPACE_ID,
  point: PUBLIC_ENVIRONMENT === 'local' ? enumSvelteKVPoint.api : enumSvelteKVPoint.platform,
}
