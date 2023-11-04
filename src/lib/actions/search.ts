import schema from '$lib/zod/search'
import { one } from '$lib/catch/error'
import type { Action } from '@sveltejs/kit'
import actionCatch from '$lib/catch/actionCatch'
import validateFields from '$lib/form/validateFields'
import getSearchSources from '$lib/dgraph/getSearchSources'


export default (async ({ request }) => {
  try {
    const fields = Object.fromEntries((await request.formData()).entries())
    await validateFields(fields, schema)

    const isQuotesChecked = fields.quotes?.toString() === 'on'
    const isSourcesByTitleChecked = fields.sourcesByTitle?.toString() === 'on'
    const isSourcesByDescriptionChecked = fields.sourcesByDescription?.toString() === 'on'

    if (!isQuotesChecked && !isSourcesByTitleChecked && !isSourcesByDescriptionChecked) throw one('Select atleast one checkbox please', fields)
    else return getSearchSources(fields.query.toString(), isQuotesChecked, isSourcesByTitleChecked, isSourcesByDescriptionChecked)
  } catch (e) {
    return actionCatch(e)
  }
}) satisfies Action
