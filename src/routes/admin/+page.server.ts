
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { SearchOrdersRequest } from '$lib'
import { queryOrder } from '$lib/ace/queryOrder'
import { pageServerCatch } from '$lib/global/catch'
import { toInputValue } from '@feelinglovelynow/datetime-local'


export const load = (async ({ locals }) => {
  try {
    if (!locals.userId) redirect(302, '/auth/sign-in')
    else {
      const endDate = new Date((new Date()).getTime() + (3 * 60000)) // now + 3 minutes

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 90) // now - 90 days

      const search: SearchOrdersRequest = {
        startDate: toInputValue(startDate),
        endDate: toInputValue(endDate)
      }

      return {
        search,
        orders: await queryOrder(search)
      }
    }
  } catch (e) {
    return pageServerCatch(e)
  }
}) satisfies PageServerLoad
