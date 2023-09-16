import type { LayoutServerLoad } from './$types'


export const load = (({ url, locals }) => {
  const { pathname } = url

  return { locals, pathname }
}) satisfies LayoutServerLoad
