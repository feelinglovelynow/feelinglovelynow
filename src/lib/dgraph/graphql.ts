import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY } from '$env/static/private'


export default async function graphql ({ query, variables }: { query: string, variables?: { [k: string]: string } }) {
  const fetchResponse = await fetch(DGRAPH_CLOUD_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'X-Auth-Token': DGRAPH_CLOUD_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })

  return await fetchResponse.json()
}
