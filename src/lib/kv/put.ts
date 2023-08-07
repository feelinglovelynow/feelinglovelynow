import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_API_TOKEN, CLOUDFLARE_KV_NAMESPACE_ID } from "$env/static/private"


export default async function put (key: string, value: string, metadata?: string) {
  if (!value) return { errors: [{ message: 'No value provided to put' }] }
  else {
    const formData  = new FormData()
    formData.append('value', value)
    formData.append('metadata', metadata || JSON.stringify({}))

    const fetchResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ CLOUDFLARE_ACCOUNT_ID }/storage/kv/namespaces/${ CLOUDFLARE_KV_NAMESPACE_ID }/values/${ key }`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${ CLOUDFLARE_KV_API_TOKEN }`
      }
    })

    return await fetchResponse.json()
  }
}
