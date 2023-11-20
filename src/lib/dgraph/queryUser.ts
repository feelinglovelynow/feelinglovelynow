import type { User } from '$lib'
import credentials from '$lib/dgraph/credentials'
import { DgraphTransaction } from '$lib/global/dgraph'


export default async function queryUser (email: string): Promise<User | undefined> {
  const transaction = new DgraphTransaction({ ...credentials(), readOnly: true, bestEffort: true })

  const r = await transaction.query(true, `
    query {
      users(func: eq(User.email, "${ email }")) {
        uid
        email: User.email
        firstName: User.firstName
      }
    }
  `)

  return r?.data?.users?.[0] as User | undefined
}
