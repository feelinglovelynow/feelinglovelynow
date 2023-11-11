import { Buffer } from 'buffer/'
import type { TokenPayload } from '$lib'
import { enumTokenType } from '$lib/global/enums'
import { verifyJWT } from '@feelinglovelynow/jwt'
import { JWK_FOR_ACCESS_TOKEN_PUBLIC, JWK_FOR_REFRESH_TOKEN_PUBLIC, JWK_FOR_SIGN_IN_PUBLIC } from '$env/static/private'


export default async function verifyToken (type: enumTokenType, jwt: string): Promise<TokenPayload> {
  switch (type) {
    case enumTokenType.ACCESS: return await verifyJWT(jwt, JWK_FOR_ACCESS_TOKEN_PUBLIC, Buffer)
    case enumTokenType.REFRESH: return await verifyJWT(jwt, JWK_FOR_REFRESH_TOKEN_PUBLIC, Buffer)
    case enumTokenType.SIGN_IN: return await verifyJWT(jwt, JWK_FOR_SIGN_IN_PUBLIC, Buffer)
  }
}
