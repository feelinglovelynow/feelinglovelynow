import { many } from '$lib/catch/error'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY, DGRAPH_CLOUD_URL_QA, DGRAPH_CLOUD_API_KEY_QA } from '$env/static/private'


export default async function dgraph ({ query, variables }: { query: string, variables?: any }) {
  const url = (PUBLIC_ENVIRONMENT === 'main') ? DGRAPH_CLOUD_URL : DGRAPH_CLOUD_URL_QA
  const apiKey = (PUBLIC_ENVIRONMENT === 'main') ? DGRAPH_CLOUD_API_KEY : DGRAPH_CLOUD_API_KEY_QA

  const rFetch = await fetch(url, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'X-Auth-Token': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })

  const r = await rFetch.json()

  if (r.errors?.length) throw many(r.errors.map((e: { message: string  }) => e.message), { query, variables: JSON.stringify(variables), r: JSON.stringify(r) })
  else return r.data
}
