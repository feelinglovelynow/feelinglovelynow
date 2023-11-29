import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { pageServerCatch } from '$lib/global/catch'
import userIsAuthenticated from '$lib/auth/userIsAuthenticated'
import deleteAccessAndRefreshCookies from '$lib/auth/deleteAccessAndRefreshCookies'
import viaCookiesOrRefreshTokenDeleteSession from '$lib/auth/viaCookiesOrRefreshTokenDeleteSession'


export const load = (async ({ locals, cookies }) => {
  try {
    userIsAuthenticated(locals)
    await viaCookiesOrRefreshTokenDeleteSession({ cookies })
    deleteAccessAndRefreshCookies(cookies)
    throw redirect(302, '/auth/sign-in')
  } catch (e) {
    return pageServerCatch(e)
  }
}) satisfies PageServerLoad
