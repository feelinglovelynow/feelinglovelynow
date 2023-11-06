import type { PageServerLoad } from './$types'
import { enumTokenType } from '$lib/util/enums'
import { one, redirect } from '$lib/catch/error'
import createToken from '$lib/auth/createToken'
import verifyToken from '$lib/auth/verifyToken'
import createSession from '$lib/auth/createSession'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { SIGN_IN_COOKIE_NAME } from '$lib/auth/variables'
import userIsNotAuthenticated from '$lib/auth/userIsNotAuthenticated'
import setAccessAndRefreshCookies from '$lib/auth/setAccessAndRefreshCookies'


export const load = (async ({ url, platform, cookies, locals, getClientAddress }) => {
  try {
    userIsNotAuthenticated(locals)
    const urlToken = url.searchParams.get('token')

    if (!urlToken) one('Please add a token to the request url', { urlToken })
    else {
      const { userId, signInId } = await verifyToken(enumTokenType.SIGN_IN, urlToken)
      const cookieSignInId = cookies.get(SIGN_IN_COOKIE_NAME)

      if (signInId !== cookieSignInId) throw one('The email link must be clicked from the same computer and browser that signed in', { signInId, cookieSignInId })
      else {
        const session = await createSession(userId, platform, getClientAddress())
        const payload = { userId, sessionId: session.id }
        const [ accessToken, refreshToken ] = await Promise.all([
          createToken(enumTokenType.ACCESS, payload),
          createToken(enumTokenType.REFRESH, payload)
        ])

        setAccessAndRefreshCookies(cookies, accessToken, refreshToken)
        throw redirect('/admin')
      }
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad
