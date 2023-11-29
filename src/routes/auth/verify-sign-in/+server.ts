import { json } from '@sveltejs/kit'
import queryUser from '$lib/dgraph/queryUser'
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

    if (!user) throw one('Please enter a valid email address', { body, user })
    else {
      const href = await sendSignInEmailAndSetCookie(cookies, user.uid, body.email, user.firstName)
      return json({ href })
    }
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
