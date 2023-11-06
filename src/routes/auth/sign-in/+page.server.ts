import type { PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import userIsNotAuthenticated from '$lib/auth/userIsNotAuthenticated'


export const load = (async ({ locals }) => {
  try {
    userIsNotAuthenticated(locals)
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad
