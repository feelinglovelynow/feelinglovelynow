import schema from '$lib/zod/emailUs'
import type { Action } from '@sveltejs/kit'
import actionCatch from '$lib/catch/actionCatch'
import validateFields from '$lib/form/validateFields'
import addSiteComment from '$lib/dgraph/addSiteComment'


export default (async ({ request }) => {
  try {
    const fields = Object.fromEntries((await request.formData()).entries()) 
    await validateFields(fields, schema)
    await addSiteComment(fields)
  } catch (e) {
    return actionCatch(e)
  }
}) satisfies Action
