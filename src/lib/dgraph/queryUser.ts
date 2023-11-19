import type { User } from '$lib'
import { dgraph } from '$lib/dgraph/dgraph'


export default async function queryUser (email: string): Promise<User | undefined> {
  const r = await dgraph({ readOnly: true, bestEffort: true, discardTxn: true, query: `
    query {
      users(func: eq(User.email, "${ email }")) {
        uid
        email: User.email
        firstName: User.firstName
      }
    }
  `})

  return r?.data?.users?.[0] as User | undefined
}
