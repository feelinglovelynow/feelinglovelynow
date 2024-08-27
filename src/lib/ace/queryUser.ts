import { ace } from '@ace/db'
import type { User } from '$lib/ace/ace'
import { ACE_DIRECTORY, ACE_ENVIRONMENT, ACE_CRYPT_IV, ACE_CRYPT_JWK } from '$env/static/private'


export async function queryUser (email: string): Promise<User | undefined> {
  const { user } = await ace({
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    ivs: { crypt: ACE_CRYPT_IV },
    jwks: { crypt: { jwk: ACE_CRYPT_JWK, type: 'crypt' } },
    req: {
      do: 'NodeQuery',
      how: {
        node: 'User',
        resKey: 'user',
        resValue: {
          $o: { findByPropValue: [ { prop: 'email', iv: 'crypt', jwk: 'crypt' }, 'equals', email ] },
          id: true,
          email: true,
          firstName: true,
        }
      }
    }
  })

  return user as User | undefined
}
