import { json } from '@sveltejs/kit'
import { queryUser } from '$lib/ace/queryUser'
import type { RequestHandler } from './$types'
import { one } from '@feelinglovelynow/svelte-catch'
import { serverCatch } from '$lib/global/catch'
import validateFields from '$lib/form/validateFields'
import sendSignInEmailAndSetCookie from '$lib/auth/sendSignInEmailAndSetCookie.ts'
import { schemaVerifySignIn, type SchemaVerifySignIn } from '$lib/zod/verifySignIn'


export const POST = (async ({ request, cookies }) => {
  try {
    const body = (await request.json()) as SchemaVerifySignIn
    await validateFields(body, schemaVerifySignIn)
    const user = await queryUser(body.email)

    if (!user?.id) throw one('Please enter a valid email address', { body, user })
    else {
      await sendSignInEmailAndSetCookie(cookies, user.id, body.email, user.firstName)
      return json({ success: true })
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
