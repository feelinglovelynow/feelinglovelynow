import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import validateFields from '$lib/form/validateFields'
import getSearchSources from '$lib/dgraph/getSearchSources'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import { schemaSearch, type SchemaSearch } from '$lib/zod/search'


export const POST = (async ({ request }) => {
  try {
    const body = (await request.json()) as SchemaSearch
    await validateFields(body, schemaSearch)
    return json(await getSearchSources(body.query, body.isQuotesChecked, body.isSourcesByTitleChecked, body.isSourcesByDescriptionChecked))
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
