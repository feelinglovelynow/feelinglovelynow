import { json } from '@sveltejs/kit'
import { enumTheme } from '$lib/global/enums'
import type { RequestHandler } from './$types'
import { serverCatch } from '$lib/global/catch'
import { one } from '@feelinglovelynow/svelte-catch'
import setThemeCookie from '$lib/theme/setThemeCookie'


export const GET = (async ({ url, cookies }) => {
  try {
    const theme = url.searchParams.get('to')

    if (theme !== enumTheme.dark && theme !== enumTheme.light) throw one('Please provide a theme of light or dark', { theme })
    else setThemeCookie(cookies, theme)

    return json({ success: true })
  } catch (e) {
    return serverCatch(e)
  }
}) satisfies RequestHandler
