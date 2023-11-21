import { json } from '@sveltejs/kit'
import send from '$lib/mailchannels/send'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import validateFields from '$lib/form/validateFields'
import addSiteComment from '$lib/dgraph/addSiteComment'
import { schemaAddSiteComment, type SchemaAddSiteComment } from '$lib/zod/addSiteComent'


export const POST = (async ({ request }) => {
  try {
    const body = (await request.json()) as SchemaAddSiteComment

    await validateFields(body, schemaAddSiteComment)
    await addSiteComment(body)
    await send({
      to: 'us@feelinglovelynow.com', 
      subject: `Site Comment From: ${ body.firstName } ${ body.lastName }`,
      content: `
        <div>
          <strong>Email:</strong><br>${ body.email }
          <br><br>
          <strong>Comment:</strong><br>${ body.comment.replace(/\n/g, '<br>') }
        </div>`,
    })

    return json({ success: true })
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
