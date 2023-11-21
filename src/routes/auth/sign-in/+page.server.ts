import type { PageServerLoad } from './$types'
import { pageServerCatch } from '$lib/global/catch'
import userIsNotAuthenticated from '$lib/auth/userIsNotAuthenticated'


export const load = (async ({ locals }) => {
  try {
    userIsNotAuthenticated(locals)
  } catch (e) {
    return pageServerCatch(e)
  }
}) satisfies PageServerLoad
