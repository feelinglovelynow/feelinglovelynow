
import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import type { SearchOrdersRequest } from '$lib'
import queryOrder from '$lib/dgraph/queryOrder'
import { pageServerCatch } from '$lib/global/catch'
import { toInputValue } from '@feelinglovelynow/datetime-local'


export const load = (async ({ locals }) => {
  try {
    if (!locals.userUid) throw redirect(302, '/auth/sign-in')
    else {
      const endDate = new Date((new Date()).getTime() + (3 * 60000)) // now + 3 minutes

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7) // now - 7 days

      const search: SearchOrdersRequest = {
        uid: '',
        email: '',
        startDate: toInputValue(startDate),
        endDate: toInputValue(endDate)
      }

      return {
        search,
        orders: await queryOrder(null, true, search)
      }
    }
  } catch (e) {
    return pageServerCatch(e)
  }
}) satisfies PageServerLoad




// import getProducts from '$lib/printful/getProducts'
// console.log(JSON.stringify(await getProducts()))