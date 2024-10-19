import { ace } from '@ace/db'
import type { Order } from '$lib/ace/ace'
import type { SearchOrdersRequest } from '$lib/global/route'
import { ACE_CRYPT_IV, ACE_CRYPT_JWK, ACE_DIRECTORY, ACE_ENVIRONMENT } from '$env/static/private'


export async function queryOrder (search?: SearchOrdersRequest): Promise<Order[] | undefined> {
  const { orders } = await ace({
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    ivs: { crypt: ACE_CRYPT_IV },
    jwks: { crypt: { jwk: ACE_CRYPT_JWK, type: 'crypt' } },
    req: {
      do: 'NodeQuery',
      how: {
        node: 'Order',
        resKey: 'orders',
        resValue: {
          id: true,
          createdAt: true,
          name: { iv: 'crypt', jwk: 'crypt' },
          addressLine1: { iv: 'crypt', jwk: 'crypt' },
          addressLine2: { iv: 'crypt', jwk: 'crypt' },
          city: { iv: 'crypt', jwk: 'crypt' },
          state: { iv: 'crypt', jwk: 'crypt' },
          country: { iv: 'crypt', jwk: 'crypt' },
          zip: { iv: 'crypt', jwk: 'crypt' },
          email: { iv: 'crypt', jwk: 'crypt' },
          totalPrice: true,
          items: {
            id: true,
            status: true,
            size: true,
            quantity: true,
            refundAmount: true,
            shippingCarrier: true,
            shippingTrackingId: true,
            product: {
              id: true,
              enum: true,
              name: true,
              image: {
                id: true,
                extension: true,
              }
            }
          }
        }
      }
    }
  })

  return orders as Order[] | undefined
}
