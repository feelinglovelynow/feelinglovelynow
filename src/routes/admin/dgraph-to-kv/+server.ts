import put from '$lib/kv/put'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import getLibrarySources from '$lib/dgraph/getLibrarySources'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'


export const GET = (async () => {
  if (PUBLIC_ENVIRONMENT !== 'local') return json({ error: 'Unauthorized' })
  else {
    const sources = await getLibrarySources()
    return json(await put('sources', JSON.stringify(sources)))
  }
}) satisfies RequestHandler
