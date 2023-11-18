import { one } from '$lib/catch/error'
import { enumTheme } from '$lib/global/enums'
import type { RequestHandler } from './$types'
import setThemeCookie from '$lib/theme/setThemeCookie'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const GET = (async ({ url, cookies }) => {
  try {
    const theme = url.searchParams.get('to')

    if (theme !== enumTheme.dark && theme !== enumTheme.light) throw one('Please provide a theme of light or dark', { theme })
    else setThemeCookie(cookies, theme)

    return new Response('success')
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
