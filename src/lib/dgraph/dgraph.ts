import { many } from '$lib/catch/error'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY, DGRAPH_CLOUD_URL_QA, DGRAPH_CLOUD_API_KEY_QA } from '$env/static/private'


export default async function dgraph ({ query, variables }: { query: string, variables?: any }) {
  const params = PUBLIC_ENVIRONMENT === 'main' ?
    { url: DGRAPH_CLOUD_URL, apiKey: DGRAPH_CLOUD_API_KEY } :
    { url: DGRAPH_CLOUD_URL_QA, apiKey: DGRAPH_CLOUD_API_KEY_QA }

  const rFetch = await fetch(params.url, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: { 'Accept': 'application/json', 'X-Auth-Token': params.apiKey, 'Content-Type': 'application/json' },
  })

  const r = await rFetch.json()

  if (r.errors?.length) throw many(r.errors.map((e: { message: string  }) => e.message), { query, variables: JSON.stringify(variables), r: JSON.stringify(r) })
  else return r.data
}
