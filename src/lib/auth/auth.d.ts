interface TokenBasic { userUid: string } // https://stackoverflow.com/a/61281828
interface TokenWithIPAddress extends TokenBasic { signInId: string, sessionUid?: never }
interface TokenWithSessionUid extends TokenBasic { sessionUid: string, signInId?: never }
export type TokenPayload = TokenWithIPAddress | TokenWithSessionUid


export type GetTokenResponseData = {
  error?: string,
  token?: string,
}


export type VerifySignInEmailTokenResponseData = {
  error?: string,
  userUid?: string,
  ipAddress?: string,
}


export type VerifyAccessAndRefreshTokenResponseData = {
  error?: string,
  userUid?: string,
  sessionUid?: string,
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
