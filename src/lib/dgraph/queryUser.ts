import type { User } from '$lib'
import dgraph from '$lib/dgraph/dgraph'


export default async function queryUser (email: string): Promise<User> {
  const { queryUser } = await dgraph({
    query: `
      query MyQuery {
        queryUser(filter: {email: {eq: "${ email }"}}) {
          id
          email
          firstName
        }
      }
    `
  })

  return queryUser[0] as User
}
