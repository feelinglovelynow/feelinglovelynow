import getUrl from '$lib/kv/getUrl'
import { CLOUDFLARE_KV_API_TOKEN } from '$env/static/private'


export default async function put (key: string, value: string, metadata?: string) {
  if (!key) throw { _errors: [ 'No key provided to kv > put' ] }
  else if (!value) throw { _errors: [ 'No value provided to kv > put' ] }
  else {
    const formData  = new FormData()
    formData.append('value', value)
    formData.append('metadata', metadata || JSON.stringify({}))

    const fetchResponse = await fetch(getUrl(key), {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${ CLOUDFLARE_KV_API_TOKEN }`
      }
    })

    const response = await fetchResponse.json()

    if (response?.success === false) throw { _errors: response.errors.map((e: any) => e.message) }
    else return response
  }
}
