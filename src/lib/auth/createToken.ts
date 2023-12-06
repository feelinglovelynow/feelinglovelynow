import { Buffer } from 'buffer/'
import type { TokenPayload } from '$lib'
import { enumTokenType } from '$lib/global/enums'
import { createJWT } from '@feelinglovelynow/jwt'
import { one } from '@feelinglovelynow/svelte-catch'
import { JWK_FOR_ACCESS_TOKEN_PRIVATE, JWK_FOR_REFRESH_TOKEN_PRIVATE, JWK_FOR_SIGN_IN_PRIVATE } from '$env/static/private'
import { ACCESS_COOKIE_MAX_AGE_IN_SECONDS, REFRESH_COOKIE_MAX_AGE_IN_SECONDS, SIGN_IN_COOKIE_MAX_AGE_IN_SECONDS } from '$lib/auth/variables'


export default async function createToken (type: enumTokenType, data: TokenPayload): Promise<string> {
  switch (type) {
    case enumTokenType.ACCESS: return await _createToken(type, data, JWK_FOR_ACCESS_TOKEN_PRIVATE, ACCESS_COOKIE_MAX_AGE_IN_SECONDS, (data) => Boolean(data.userUid && data.sessionUid), `Please pass userUid and sessionUid w/in data`)
    case enumTokenType.REFRESH: return await _createToken(type, data, JWK_FOR_REFRESH_TOKEN_PRIVATE, REFRESH_COOKIE_MAX_AGE_IN_SECONDS, (data) => Boolean(data.userUid && data.sessionUid), `Please pass userUid and sessionUid w/in data`)
    case enumTokenType.SIGN_IN: return await _createToken(type, data, JWK_FOR_SIGN_IN_PRIVATE, SIGN_IN_COOKIE_MAX_AGE_IN_SECONDS, (data) => Boolean(data.userUid && data.signInId), `Please pass userUid and signInId w/in data`)
  }
}


async function _createToken (type: string, data: TokenPayload, jwk: string, expiresInAsSeconds: number, isValid: (data: TokenPayload) => boolean, isInvalidErrorMessage: string): Promise<string> {
  if (!isValid(data)) throw one(isInvalidErrorMessage, { data, type })
  else return await createJWT(data, expiresInAsSeconds, jwk, Buffer)
}
