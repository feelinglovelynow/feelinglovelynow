import type { ReversalTransaction } from '$lib'
import braintree from '$lib/braintree/braintree'


export async function reverseTransaction (transactionId: string) {
  const body = JSON.stringify({
    query: `
      mutation ExampleReverse($input: ReverseTransactionInput!) {
        reverseTransaction(input: $input) {
          reversal {
            ... on Transaction {
              id
              status
              statusHistory {
                status
                terminal
              }
            }
            ... on Refund {
              id
              amount {
                value
              }
              orderId
              status
              refundedTransaction {
                id
                amount {
                  value
                }
                orderId
                status
              }
            }
          }
        }
      }
    `,
    variables: {
      input: {
        transactionId
      }
    }
  })

  const response = await braintree(body)

  return {
    _errors: response._errors,
    data: response.data.reverseTransaction?.reversal as ReversalTransaction
  }
}
