import { DGRAPH_CLOUD_URL, DGRAPH_CLOUD_API_KEY } from '$env/static/private'


export default async function graphql ({ query, variables }: { query: string, variables?: any }) {
  const fetchResponse = await fetch(DGRAPH_CLOUD_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'X-Auth-Token': DGRAPH_CLOUD_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  })

  const jsonResponse = await fetchResponse.json()
  const response: { _errors: string[], data: any } = { _errors: [], data: {} }

  if (jsonResponse.errors?.length) response._errors = jsonResponse.errors.map((e: any) => { return e.message })
  else response.data = jsonResponse.data

  return response
}
