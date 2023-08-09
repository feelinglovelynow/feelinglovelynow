import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID } from '$env/static/private'


export default function getUrl (key: string) {
  return `https://api.cloudflare.com/client/v4/accounts/${ CLOUDFLARE_ACCOUNT_ID }/storage/kv/namespaces/${ CLOUDFLARE_KV_NAMESPACE_ID }/values/${ key }`
}
