import { redirect } from '$lib/catch/error'
import type { PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import userIsAuthenticated from '$lib/auth/userIsAuthenticated'
import deleteAccessAndRefreshCookies from '$lib/auth/deleteAccessAndRefreshCookies'
import viaCookiesOrRefreshTokenDeleteSession from '$lib/auth/viaCookiesOrRefreshTokenDeleteSession'


export const load = (async ({ locals, cookies }) => {
  try {
    userIsAuthenticated(locals)
    await viaCookiesOrRefreshTokenDeleteSession({ cookies })
    deleteAccessAndRefreshCookies(cookies)
    throw redirect('/auth/sign-in')
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad
