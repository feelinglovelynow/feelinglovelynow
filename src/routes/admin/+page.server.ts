import search from '$lib/actions/search'
import queryOrder from '$lib/dgraph/queryOrder'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { dateToDateTimeLocal } from '$lib/util/dateToDateTimeLocal'
import { one } from '$lib/catch/error'


export const load = (async () => {
  try {
    if (PUBLIC_ENVIRONMENT === 'local') {
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