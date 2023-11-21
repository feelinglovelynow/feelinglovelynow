import { enumTheme } from '$lib/global/enums'
import type { RequestHandler } from './$types'
import { one } from '$lib/global/svelte-catch'
import { serverCatch } from '$lib/global/catch'
import setThemeCookie from '$lib/theme/setThemeCookie'


export const GET = (async ({ url, cookies }) => {
  try {
    const theme = url.searchParams.get('to')

    if (theme !== enumTheme.dark && theme !== enumTheme.light) throw one('Please provide a theme of light or dark', { theme })
    else setThemeCookie(cookies, theme)

    return new Response('success')
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
