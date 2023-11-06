import search from '$lib/actions/search'
import { redirect } from '$lib/catch/error'
import queryOrder from '$lib/dgraph/queryOrder'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { dateToDateTimeLocal } from '$lib/util/dateToDateTimeLocal'


export const load = (async ({ locals }) => {
  try {
    if (!locals.userId) throw redirect('/auth/sign-in')
    else {
      const endDate = new Date((new Date()).getTime() + (3 * 60000)) // now + 3 minutes

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7) // now - 7 days

      const search = {
        orderId: '',
        email: '',
        startDate: dateToDateTimeLocal(startDate),
        endDate: dateToDateTimeLocal(endDate)
      }

      return {
        search,
        orders: await queryOrder(search)
      }
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
} satisfies Actions




// import getProducts from '$lib/printful/getProducts'
// console.log(JSON.stringify(await getProducts()))