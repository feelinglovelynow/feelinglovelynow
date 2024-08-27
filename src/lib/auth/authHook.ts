import type { Session } from '$lib'
import createToken from '$lib/auth/createToken'
import verifyToken from '$lib/auth/verifyToken'
import { enumTokenType } from '$lib/global/enums'
import type { RequestEvent } from '@sveltejs/kit'
import { get, updateIP } from '$lib/auth/sessions'
import { log } from '@feelinglovelynow/svelte-catch'
import setAccessAndRefreshCookies from '$lib/auth/setAccessAndRefreshCookies'
import deleteAccessAndRefreshCookies from '$lib/auth/deleteAccessAndRefreshCookies'
import viaCookiesGetAccessAndRefreshTokens from '$lib/auth/viaCookiesGetAccessAndRefreshTokens'
import viaCookiesOrRefreshTokenDeleteSession from '$lib/auth/viaCookiesOrRefreshTokenDeleteSession'


export default async function authHook (event: RequestEvent): Promise<RequestEvent> {
  const { accessToken, refreshToken } = viaCookiesGetAccessAndRefreshTokens(event.cookies)

  if (refreshToken) {
    if (!accessToken) await onAccessTokenExpired(event, refreshToken)
    else {
      try {
        const { sessionId } = await verifyToken(enumTokenType.ACCESS, accessToken)

        if (!sessionId) await signThemOut(event, refreshToken) // if no sessionId found in token => sign them out
        else {
          const session = await get(sessionId) // find session based on access token

          if (!session?.user?.id) deleteAccessAndRefreshCookies(event.cookies) // if session not found, this is a signed out user so => delete cookies
          else event.locals.userId = session.user.id // session found so add userId to locals so server code down stream may access it
        }
      } catch (e: any) {
        if (e?.id === 'fln__verify__expired') await onAccessTokenExpired(event, refreshToken) // if access token is expired
        else if (e?.id?.startsWith('fln__verify__')) await signThemOut(event, refreshToken)  // if access token error is not a token expired error => sign them out
        else log({ e })
      }
    }
  }

  return event
}


async function onAccessTokenExpired (event: RequestEvent, refreshToken: string): Promise<void> {
  try {
    const { sessionId } = await verifyToken(enumTokenType.REFRESH, refreshToken) // verify the refresh token

    if (sessionId) { // if refresh token is good
      const session = await get(sessionId) // get graph session
      if (!session) deleteAccessAndRefreshCookies(event.cookies) // IF no graph session => this is a signed out user so delete their current cookies
      else await createNewSessionTokenAndCookies(event, session) // graph session found => create new session, tokens, cookies
    }
  } catch (e: any) {
    if (e?.id?.startsWith('fln__verify__')) await signThemOut(event, refreshToken) // if refreshToken has a verify error this is a signed out user so => sign them out
    else log({ e })
  }
}


async function signThemOut (event: RequestEvent, refreshToken: string): Promise<void> {
  try {
    await viaCookiesOrRefreshTokenDeleteSession({ refreshToken }) // delete their session 
    deleteAccessAndRefreshCookies(event.cookies) // delete their cookies 
  } catch (e) {
    log({ e })
  }
}


async function createNewSessionTokenAndCookies (event: RequestEvent, session: Session): Promise<void> {
  if (session.user?.id && session.id) {
    const payload = { userId: session.user.id, sessionId: session.id }
    const [ accessToken, refreshToken ] = await Promise.all([ createToken(enumTokenType.ACCESS, payload), createToken(enumTokenType.REFRESH, payload) ]) // create new auth tokens for this user
  
    await updateIP(session.id, event.getClientAddress()) // update graph session with their most recent ip address
    setAccessAndRefreshCookies(event.cookies, accessToken, refreshToken) // set auth cookies w/ newly created tokens
    event.locals.userId = session.user.id // add userId to locals so server code down stream may access it
  }
}
