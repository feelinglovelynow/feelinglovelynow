import type { Actions } from './$types'
import search from '$lib/actions/search'
import imageAI from '$lib/actions/imageAI'


export const actions = {
  search,
  imageAI,
} satisfies Actions
