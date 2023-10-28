import search from '$lib/actions/search'
import queryOrder from '$lib/dgraph/queryOrder'
// import getProducts from '$lib/printful/getProducts'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'


export const load = (async () => {
  try {
    if (PUBLIC_ENVIRONMENT === 'local') {
      // console.log(JSON.stringify(await getProducts()))
      const orders = await queryOrder()

      for (const order of orders) {
        for (const orderItem of order.orderItems) {
          if (orderItem.product) orderItem.product.primaryImage.src = (await import(`../../lib/img/store/${ orderItem.product.primaryImage.id }.${ orderItem.product.primaryImage.extension }`)).default
        }
      }

      return { orders }
    }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search,
} satisfies Actions
