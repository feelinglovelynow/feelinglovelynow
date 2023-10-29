import search from '$lib/actions/search'
import queryOrder from '$lib/dgraph/queryOrder'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { dateToDateTimeLocal } from '$lib/util/dateToDateTimeLocal'


export const load = (async () => {
  try {
    if (PUBLIC_ENVIRONMENT === 'local') {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)

      const search = {
        orderId: '',
        email: '',
        startDate: dateToDateTimeLocal(startDate),
        endDate: dateToDateTimeLocal(new Date())
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