import type { Transaction } from '$lib'
import braintree from '$lib/braintree/braintree'


export async function createTransaction (nonce: string, amount: string) {
  const body = JSON.stringify({
    query: `
      mutation Charge($input: ChargePaymentMethodInput!) {
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
        transaction: { amount: amount }
      }
    }
  })

  const response = await braintree(body)

  return {
    _errors: response._errors,
    data: response.data.chargePaymentMethod?.transaction as Transaction
  }
}
