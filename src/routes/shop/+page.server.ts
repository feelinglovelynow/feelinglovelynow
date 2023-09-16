// import braintree from 'braintree'
import search from '$lib/actions/search'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, BRAINTEE_PRIVATE_KEY, PRINTFUL_API_TOKEN } from '$env/static/private'


export const load = (async () => {
  try {
    // const gateway = new braintree.BraintreeGateway({
    //   environment: braintree.Environment.Sandbox,
    //   merchantId: BRAINTREE_MERCHANT_ID,
    //   publicKey: BRAINTREE_PUBLIC_KEY,
    //   privateKey: BRAINTEE_PRIVATE_KEY
    // })

    // const responses = await Promise.all([
    //   gateway.clientToken.generate({}),
    //   fetch('https://api.printful.com/store/products', {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${ PRINTFUL_API_TOKEN }`,
    //     }
    //   })
    // ])

    // const response = {
    //   braintree: responses[0].clientToken,
    //   printful: await responses[1].json(),
    // }
    
    // console.log(response)
    // return response
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
