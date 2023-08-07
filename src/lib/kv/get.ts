import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_API_TOKEN, CLOUDFLARE_KV_NAMESPACE_ID } from '$env/static/private'


export default async function get (namespace: string, key: string, platform?: App.Platform) {
  if (PUBLIC_ENVIRONMENT !== 'local' && platform) return JSON.parse(await platform.env[ namespace ].get(key))
  else {
    const fetchResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ CLOUDFLARE_ACCOUNT_ID }/storage/kv/namespaces/${ CLOUDFLARE_KV_NAMESPACE_ID }/values/${ key }`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ CLOUDFLARE_KV_API_TOKEN }`
      }
    })

    return await fetchResponse.json()
  }
}
