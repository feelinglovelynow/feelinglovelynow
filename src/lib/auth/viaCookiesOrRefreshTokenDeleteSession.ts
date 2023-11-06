import { Buffer } from 'buffer/'
import type { Session } from '$lib'
import { remove } from '$lib/auth/sessions'
import type { Cookies } from '@sveltejs/kit'
import { REFRESH_COOKIE_NAME } from '$lib/auth/variables'


export default async ({ cookies, refreshToken }: { cookies?: Cookies, refreshToken?: string }): Promise<Session | undefined> => {
  let session

  if (cookies) refreshToken = cookies.get(REFRESH_COOKIE_NAME)

  if (refreshToken) {
    const base64Payload = refreshToken.split('.')[1]
    const { sessionId } = JSON.parse((Buffer.from(base64Payload, 'base64')).toString('utf-8'))
    session = await remove(sessionId)
  }

  return session
}
