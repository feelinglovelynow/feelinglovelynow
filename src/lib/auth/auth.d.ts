interface TokenBasic { userId: number } // https://stackoverflow.com/a/61281828
interface TokenWithIPAddress extends TokenBasic { signInId: string, sessionId?: never }
interface TokenWithSessionId extends TokenBasic { sessionId: number, signInId?: never }
export type TokenPayload = TokenWithIPAddress | TokenWithSessionId


export type GetTokenResponseData = {
  error?: string,
  token?: string,
}


export type VerifySignInEmailTokenResponseData = {
  error?: string,
  userId?: string,
  ipAddress?: string,
}


export type VerifyAccessAndRefreshTokenResponseData = {
  error?: string,
  userId?: string,
  sessionId?: string,
}


export type GetTokenResponse = Promise<GetTokenResponseData>
export type VerifySignInEmailTokenResponse = Promise<VerifySignInEmailTokenResponseData>
export type VerifyAccessAndRefreshEmailTokenResponse = Promise<VerifyAccessAndRefreshTokenResponseData>


export type AuthCookieOptions = {
  path: string
  httpOnly: boolean
  sameSite: 'lax'
  secure: boolean
}
