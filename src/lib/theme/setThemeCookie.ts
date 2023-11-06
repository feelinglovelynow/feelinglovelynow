import type { Cookies } from '@sveltejs/kit'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'


export default function setThemeCookie (cookies: Cookies, theme: string) {
  cookies.set('fln__theme', theme, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: PUBLIC_ENVIRONMENT !== 'local'
  })
}
