import { remove } from '$lib/auth/sessions'
import type { Cookies } from '@sveltejs/kit'
import { REFRESH_COOKIE_NAME } from '$lib/auth/variables'


export default async function viaCookiesOrRefreshTokenDeleteSession ({ cookies, refreshToken }: { cookies?: Cookies, refreshToken?: string }): Promise<void> {
  if (cookies) refreshToken = cookies.get(REFRESH_COOKIE_NAME)

  if (refreshToken) {
    const base64Payload = refreshToken.split('.')[1]
    const { sessionId } = JSON.parse((Buffer.from(base64Payload, 'base64')).toString('utf-8'))
    await remove(sessionId)
  }
}
