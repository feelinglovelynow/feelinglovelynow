import getUrl from '$lib/kv/getUrl'
import respond from '$lib/kv/respond'
import { one } from '$lib/catch/error'
import { CLOUDFLARE_KV_API_TOKEN } from '$env/static/private'


export default async function put (key: string, value: string, metadata?: string) {
  if (!key) throw one('Please provide key', { key, value })
  else if (!value) throw one('Please provide value', { key, value })
  else {
    const formData  = new FormData()
    formData.append('value', value)
    formData.append('metadata', metadata || JSON.stringify({}))

    return respond(await fetch(getUrl(key), {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${ CLOUDFLARE_KV_API_TOKEN }`
      }
    }))
  }
}
