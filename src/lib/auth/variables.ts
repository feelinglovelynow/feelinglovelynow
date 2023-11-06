import type { AuthCookieOptions } from '$lib'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'

export const SIGN_IN_COOKIE_NAME = 'fln__token__sign-in'
export const SIGN_IN_COOKIE_MAX_AGE_IN_SECONDS = 540 // 9 minutes

export const ACCESS_COOKIE_NAME = 'fln__token__access'
export const ACCESS_COOKIE_MAX_AGE_IN_SECONDS = 32400 // 9 hours

export const REFRESH_COOKIE_NAME = 'fln__token__refresh'
export const REFRESH_COOKIE_MAX_AGE_IN_SECONDS = 777600 // 9 days

export const commonCookieDeleteSettings = { path: '/' }
export function getCommonCookieSetSettings (): AuthCookieOptions {
  return {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: PUBLIC_ENVIRONMENT !== 'local',
  }
}
