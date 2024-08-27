import { ace, td } from '@ace/db'
import type { Session } from '$lib'
import { ACE_DIRECTORY, ACE_ENVIRONMENT } from '$env/static/private'


export async function get (sessionId: number): Promise<Session | undefined> {
  const { session } = await ace({
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    req: {
      do: 'NodeQuery',
      how: {
        node: 'Session',
        resKey: 'session',
        resValue: {
          $o: { findById: sessionId },
          id: true,
          ipAddress: true,
          accessExpiration: true,
          refreshExpiration: true,
          user: {
            id: true,
          }
        }
      }
    }
  })

  return session as Session | undefined
}


export async function add (session: Session): Promise<number | undefined> {
  let sessionId

  if (session.user?.id) {
    const { $ace } = await ace({
      dir: ACE_DIRECTORY,
      env: ACE_ENVIRONMENT,
      req: [
        {
          do: 'NodeInsert',
          how: {
            node: 'Session',
            props: {
              id: '_:session',
              ipAddress: session.ipAddress,
              accessExpiration: session.accessExpiration,
              refreshExpiration: session.refreshExpiration,
            }
          }
        },
        {
          do: 'RelationshipInsert',
          how: {
            relationship: 'userSessions',
            props: {
              a: session.user.id,
              b: '_:session',
            }
          }
        }
      ]
    })

    sessionId = $ace?.enumIds?.['_:session']
  }

  return sessionId // newly created session id
}


export async function remove (sessionId: string): Promise<td.AceFnResponse> {
  return await ace({
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    req: {
      do: 'NodeDelete',
      how: [ sessionId ]
    }
  })
}


export async function updateIP (id: number, ipAddress: string): Promise<td.AceFnResponse> {
  return await ace({
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    req: {
      do: 'NodeUpdate',
      how: {
        node: 'Session',
        props: {
          id,
          ipAddress,
        }
      }
    }
  })
}
