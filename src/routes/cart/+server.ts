import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { BRAINTREE_BASE_64 } from '$env/static/private'


export const POST = (async ({ request }) => {
  const errors: string[] = []
  const response: any = { errors }
  const body = await request.json()

  if (!body.name) errors.push('Please add Name')
  if (!body.email) errors.push('Please add Email')
  if (!body.address) errors.push('Please add Shipping: Address')
  if (!body.zip) errors.push('Please add Shipping: Zip')
  if (!body.country) errors.push('Please add Shipping: Country')
  if (!body.nonce) errors.push('Please add valid Billing Information')
  if (!body.totalPrice.num) errors.push('Please add a price')

  if (errors.length) return json(response, { status: 400 })
  else {
    // add nonce to braintree
    // on success add order to dgraph
    response.body = body
    return json(response, { status: 200 })
  }

  
  // const fetchResponse = await fetch('https://payments.sandbox.braintree-api.com/graphql', {
  //   method: 'POST',
  //   headers: {
  //     'Braintree-Version': '2023-09-23',
  //     'content-type': 'application/json',
  //     'Authorization': `Basic ${ BRAINTREE_BASE_64 }`
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       mutation ExampleCharge($input: ChargePaymentMethodInput!) {
  //         chargePaymentMethod(input: $input) {
  //           transaction {
  //             id
  //             status
  //           }
  //         }
  //       }
  //     `,
  //     variables: {
  //       input: {
  //         paymentMethodId: nonce,
  //         transaction: { amount: '3.14' }
  //       }
  //     }
  //   })
  // })


  // const response = await fetchResponse.json()
  // const transaction = response?.data?.chargePaymentMethod?.transaction
  // console.log('transaction', transaction)
}) satisfies RequestHandler
