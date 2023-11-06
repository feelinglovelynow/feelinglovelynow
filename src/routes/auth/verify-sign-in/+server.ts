import { json } from '@sveltejs/kit'
import { one } from '$lib/catch/error'
import queryUser from '$lib/dgraph/queryUser'
import type { RequestHandler } from './$types'
import serverRequestCatch from '$lib/catch/serverRequestCatch'
import sendSignInEmailAndSetCookie from '$lib/auth/sendSignInEmailAndSetCookie.ts'


export const POST = (async ({ request, cookies }) => {
  try {
    const body = await request.json() as { email: string }

    if (!body.email) throw one('Please add an email to the request body', { body })
    else {
      const user = await queryUser(body.email)

      if (!user) throw one('Please enter a valid email address', { body, user })
      else {
        const href = await sendSignInEmailAndSetCookie(cookies, user.id, body.email, user.firstName)
        return json({ href })
      }
    }
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
