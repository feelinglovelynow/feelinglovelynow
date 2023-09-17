import schema from '$lib/zod/emailUs'
import send from '$lib/mailchannels/send'
import type { Action } from '@sveltejs/kit'
import actionCatch from '$lib/catch/actionCatch'
import validateFields from '$lib/form/validateFields'
import addSiteComment from '$lib/dgraph/addSiteComment'


export default (async ({ request }) => {
  try {
    const fields = Object.fromEntries((await request.formData()).entries()) 
    await validateFields(fields, schema)
    await addSiteComment(fields)
    await send({
      to: 'chris@feelinglovelynow.com', 
      subject: `Site Comment From: ${ fields.firstName } ${ fields.lastName }`,
      content: `
        <div>
          <strong>Email:</strong><br>${ fields.email.toString() }
          <br><br>
          <strong>Comment:</strong><br>${ fields.comment.toString().replace(/\n/g, '<br>') }
        </div>`,
    })
  } catch (e) {
    return actionCatch(e)
  }
}) satisfies Action
