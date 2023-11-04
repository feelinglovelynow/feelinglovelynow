import getUrl from '$lib/kv/getUrl'
import respond from '$lib/kv/respond'
import { one } from '$lib/catch/error'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { CLOUDFLARE_KV_API_TOKEN } from '$env/static/private'


export default async function get (namespace: string, key: string, platform?: App.Platform) {
  if (!key) throw one('Please provide a key', { key })
  else if (PUBLIC_ENVIRONMENT !== 'local' && platform) return JSON.parse(await platform.env[ namespace ].get(key))
  else {
    return respond(await fetch(getUrl(key), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ CLOUDFLARE_KV_API_TOKEN }`
      }
    }))
  }
}
