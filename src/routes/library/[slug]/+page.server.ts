import get from '$lib/kv/get'
import search from '$lib/actions/search'
import type { Actions } from './$types'


export const actions = {
  search,
} satisfies Actions
