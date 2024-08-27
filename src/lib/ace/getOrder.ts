import { ace } from '@ace/db'
import type { Order } from '$lib/ace/ace'
import { ACE_DIRECTORY, ACE_ENVIRONMENT } from '$env/static/private'


export async function getOrder (orderId: number): Promise<Order | undefined> {
  const { order } = await ace({
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    req: {
      do: 'NodeQuery',
      how: {
        node: 'Order',
        resKey: 'order',
        resValue: {
          $o: { findById: orderId },
          id: true,
          name: true,
          addressLine1: true,
          addressLine2: true,
          city: true,
          state: true,
          country: true,
          zip: true,
          email: true,
          items: {
            id: true,
            status: true,
            size: true,
            quantity: true,
            refundAmount: true,
            product: {
              id: true,
            }
          }
        }
      }
    }
  })

  return order as Order | undefined
}
