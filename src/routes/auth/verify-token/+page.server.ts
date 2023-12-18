import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import createToken from '$lib/auth/createToken'
import verifyToken from '$lib/auth/verifyToken'
import { enumTokenType } from '$lib/global/enums'
import createSession from '$lib/auth/createSession'
import { pageServerCatch } from '$lib/global/catch'
import { one } from '@feelinglovelynow/svelte-catch'
import { SIGN_IN_COOKIE_NAME } from '$lib/auth/variables'
import userIsNotAuthenticated from '$lib/auth/userIsNotAuthenticated'
import setAccessAndRefreshCookies from '$lib/auth/setAccessAndRefreshCookies'


export const load = (async ({ url, cookies, locals, getClientAddress }) => {
  try {
    userIsNotAuthenticated(locals)
    const urlToken = url.searchParams.get('token')

    if (!urlToken) one('Please add a token to the request url', { urlToken })
    else {
      const { userUid, signInId } = await verifyToken(enumTokenType.SIGN_IN, urlToken)
      const cookieSignInId = cookies.get(SIGN_IN_COOKIE_NAME)

      if (signInId !== cookieSignInId) throw one('The email link must be clicked from the same computer and browser that signed in', { signInId, cookieSignInId })
      else {
        const sessionUid = await createSession(userUid, getClientAddress())
        const payload = { userUid, sessionUid }
        const [ accessToken, refreshToken ] = await Promise.all([
          createToken(enumTokenType.ACCESS, payload),
          createToken(enumTokenType.REFRESH, payload)
        ])

        setAccessAndRefreshCookies(cookies, accessToken, refreshToken)
        redirect(302, '/admin')
      }
    }
  } catch (e) {
    return pageServerCatch(e)
  }
}) satisfies PageServerLoad
