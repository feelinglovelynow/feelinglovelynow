import type { LayoutServerLoad } from './$types'


export const load = (({ url, locals }) => {
  const { href } = url

  return { locals, href }
}) satisfies LayoutServerLoad
