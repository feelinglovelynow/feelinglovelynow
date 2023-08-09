import getUrl from '$lib/kv/getUrl'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { CLOUDFLARE_KV_API_TOKEN } from '$env/static/private'


export default async function get (namespace: string, key: string, platform?: App.Platform) {
  if (!key) throw { _errors: [ 'No key provided to kv > get' ] }
  else if (PUBLIC_ENVIRONMENT !== 'local' && platform) return JSON.parse(await platform.env[ namespace ].get(key))
  else {
    const fetchResponse = await fetch(getUrl(key), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ CLOUDFLARE_KV_API_TOKEN }`
      }
    })

    const response = await fetchResponse.json()

    if (response?.success === false) throw { _errors: response.errors.map((e: any) => e.message) }
    else return response
  }
}
