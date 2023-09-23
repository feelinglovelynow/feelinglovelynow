import type { RequestHandler } from './$types'
import { BRAINTREE_BASE_64 } from '$env/static/private'


export const POST = (async ({ request }) => {
  const { nonce } = await request.json()


  const fetchResponse = await fetch('https://payments.sandbox.braintree-api.com/graphql', {
    method: 'POST',
    headers: {
      'Braintree-Version': '2023-09-23',
      'content-type': 'application/json',
      'Authorization': `Basic ${ BRAINTREE_BASE_64 }`
    },
    body: JSON.stringify({
      query: `
        mutation ExampleCharge($input: ChargePaymentMethodInput!) {
          chargePaymentMethod(input: $input) {
            transaction {
              id
              status
            }
          }
        }
      `,
      variables: {
        input: {
          paymentMethodId: nonce,
          transaction: { amount: '3.14' }
        }
      }
    })
  })


  const response = await fetchResponse.json()
  const transaction = response?.data?.chargePaymentMethod?.transaction
  console.log('transaction', transaction)
  return new Response('success')
}) satisfies RequestHandler
