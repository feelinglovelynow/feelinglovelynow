import type { LayoutServerLoad } from './$types'


export const load = (({ url, locals }) => {
  let key = ''

  if (url.pathname !== '/library') key = url.href
  else { // we do not want page transitons if there is a count in the url (user is infinite scrolling)
    const newUrl = new URL(url)
    newUrl.searchParams.delete('count')
    key = newUrl.href
  }

  return { locals, key, href: url.href }
}) satisfies LayoutServerLoad
