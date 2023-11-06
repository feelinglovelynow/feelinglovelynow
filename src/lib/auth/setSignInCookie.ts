import type { Cookies } from '@sveltejs/kit'
import { SIGN_IN_COOKIE_NAME, SIGN_IN_COOKIE_MAX_AGE_IN_SECONDS, getCommonCookieSetSettings } from '$lib/auth/variables'


export default function setSignInCookie (signInId: string, cookies: Cookies) {
  cookies.set(SIGN_IN_COOKIE_NAME, signInId, { ...getCommonCookieSetSettings(), maxAge: SIGN_IN_COOKIE_MAX_AGE_IN_SECONDS })
}
