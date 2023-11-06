import type { Session } from '$lib'
import dgraph from '$lib/dgraph/dgraph'


const sessionBody = `
  id
  ipAddress
  accessExpiration
  refreshExpiration
  user {
    id
  }
`


export async function getAll (): Promise<Session[]> {
  const { querySession } = await dgraph({
    query: `
      query MyQuery {
        querySession {
          ${ sessionBody }
        }
      }
    `
  })

  return querySession as Session[]
}


export async function getOne (sessionId: string): Promise<Session> {
  const { getSession } = await dgraph({
    query: `
      query MyQuery {
        getSession(id: "${ sessionId }") {
          ${ sessionBody }
        }
      }
    `
  })

  return getSession as Session
}



export async function add (session: Session): Promise<Session> {
  const { addSession } = await dgraph({
    query: `
      mutation MyMutation {
        addSession(input: {refreshExpiration: "${ session.refreshExpiration }", ipAddress: "${session.ipAddress }", accessExpiration: "${ session.accessExpiration }", user: {id: "${ session.user.id }"}}) {
          session {
            ${ sessionBody }
          }
        }
      }    
    `
  })

  return addSession.session[0] as Session
}


export async function remove (sessionId: string): Promise<Session> {
  const { deleteSession } = await dgraph({
    query: `
      mutation MyMutation {
        deleteSession(filter: {id: "${ sessionId }"}) {
          session {
            ${ sessionBody }
          }
        }
      }
    `
  })

  return deleteSession.session[0] as Session
}


export async function updateIP (sessionId: string, ipAddress: string): Promise<Session> {
  const { updateSession } = await dgraph({
    query: `
      mutation MyMutation {
        updateSession(input: {filter: {id: "${ sessionId }"}, set: {ipAddress: "${ ipAddress }"}}) {
          session {
            ${ sessionBody }
          }
        }
      }
    `
  })

  return updateSession.session[0] as Session
}
