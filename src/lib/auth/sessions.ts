import type { Session, AddSession } from '$lib'
import txnOptions from '$lib/dgraph/txnOptions'
import { DgraphTransaction, type DgraphResponse } from '@feelinglovelynow/dgraph'


const sessionBody = `
  uid
  ipAddress: Session.ipAddress
  accessExpiration: Session.accessExpiration
  refreshExpiration: Session.refreshExpiration
  user: Session.user {
    uid
  }
`


export async function get (sessionUid: string): Promise<Session | undefined> {
  const transaction = new DgraphTransaction({ ...txnOptions(), readOnly: true })

  const r = await transaction.query(true, `
    query {
      sessions(func: uid(${ sessionUid })) @filter(type(Session)) {
        ${ sessionBody }
      }
    }
  `)

  return r?.data?.sessions?.[0] as Session | undefined
}


export async function add (session: AddSession): Promise<string> {
  const transaction = new DgraphTransaction({ ...txnOptions() })

  const r = await transaction.mutate({
    commitNow: true,
    mutation: `
      _:session <dgraph.type> "Session" .
      _:session <Session.user> <${ session.user.uid }> .
      _:session <Session.ipAddress> "${ session.ipAddress }" .
      _:session <Session.accessExpiration> "${ session.accessExpiration }" .
      _:session <Session.refreshExpiration> "${ session.refreshExpiration }" .
    `
  })

  return r?.data?.uids?.session // newly created session uid
}


export async function remove (sessionUid: string): Promise<DgraphResponse> {
  const transaction = new DgraphTransaction({ ...txnOptions() })

  return transaction.mutate({
    commitNow: true,
    remove: `<${ sessionUid }> * * .`
  })
}


export async function updateIP (sessionUid: string, ipAddress: string): Promise<DgraphResponse> {
  const transaction = new DgraphTransaction({ ...txnOptions() })

  return await transaction.mutate({
    commitNow: true,
     mutation: `<${ sessionUid }> <Session.ipAddress> "${ ipAddress }" .`
  })
}
