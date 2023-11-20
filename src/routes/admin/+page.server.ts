import { redirect } from '$lib/catch/error'
import type { SearchOrdersRequest } from '$lib'
import queryOrder from '$lib/dgraph/queryOrder'
import type { PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { dateToDateTimeLocal } from '$lib/global/dateToDateTimeLocal'


export const load = (async ({ locals }) => {
  try {
    if (!locals.userUid) throw redirect('/auth/sign-in')
    else {
      const endDate = new Date((new Date()).getTime() + (3 * 60000)) // now + 3 minutes

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7) // now - 7 days

      const search: SearchOrdersRequest = {
        uid: '',
        email: '',
        startDate: dateToDateTimeLocal(startDate),
        endDate: dateToDateTimeLocal(endDate)
      }

      return {
        search,
        orders: await queryOrder(null, true, search)
      }
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad




// import getProducts from '$lib/printful/getProducts'
// console.log(JSON.stringify(await getProducts()))