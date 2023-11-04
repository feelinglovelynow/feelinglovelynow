import { many } from '$lib/catch/error'
import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY } from '$env/static/private'


export default async function dgraph ({ query, variables }: { query: string, variables?: any }) {
  const rFetch = await fetch(DGRAPH_CLOUD_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'X-Auth-Token': DGRAPH_CLOUD_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })

  const r = await rFetch.json()

  if (r.errors?.length) throw many(r.errors.map((e: { message: string  }) => e.message), { query, variables: JSON.stringify(variables), r: JSON.stringify(r) })
  else return r.data
}
