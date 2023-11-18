import { dgraph } from '$lib/dgraph/dgraph'
import type { Session, AddSession, DgraphResponse } from '$lib'


const sessionBody = `
  uid
  ipAddress: Session.ipAddress
  accessExpiration: Session.accessExpiration
  refreshExpiration: Session.refreshExpiration
  user: Session.user {
    uid
  }
`


export async function getAll (): Promise<Session[]> {
  const r = await dgraph({ readOnly: true, discardTxn: true, query: `
    query {
      sessions(func: type(Session)) {
        ${ sessionBody }
      }
    }
  `})

  return r?.data?.sessions as Session[]
}


export async function getOne (sessionUid: string): Promise<Session | undefined> {
  const r = await dgraph({ readOnly: true, discardTxn: true, query: `
    query {
      sessions(func: uid(${ sessionUid })) @filter(type(Session)) {
        ${ sessionBody }
      }
    }
  `})

  return r?.data?.sessions?.[0] as Session | undefined
}


export async function add (session: AddSession): Promise<string> {
  const r = await dgraph({ commitNow: true, mutation: `
    _:session <dgraph.type> "Session" .
    _:session <Session.user> <${ session.user.uid }> .
    _:session <Session.ipAddress> "${ session.ipAddress }" .
    _:session <Session.accessExpiration> "${ session.accessExpiration }" .
    _:session <Session.refreshExpiration> "${ session.refreshExpiration }" .
  `})

  return r?.data?.uids?.session // newly created session uid
}


export async function remove (sessionUid: string): Promise<DgraphResponse> {
  return dgraph({ commitNow: true, remove: `<${ sessionUid }> * * .`})
}


export async function updateIP (sessionUid: string, ipAddress: string): Promise<DgraphResponse> {
  return await dgraph({ commitNow: true, mutation: `<${ sessionUid }> <Session.ipAddress> "${ ipAddress }" .`})
}
