import type { Actions } from './$types'
import search from '$lib/actions/search'
import emailUs from '$lib/actions/emailUs'


export const actions = {
  search,
  emailUs,
} satisfies Actions
