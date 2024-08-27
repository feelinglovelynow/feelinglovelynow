import { security } from '@ace/db'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ACE_SERVER_TOKEN, ACE_DIRECTORY, ACE_ENVIRONMENT } from '$env/static/private'


export const POST = (async ({ request }) => {
  try {
    const body = await request.json()

    const res = await security.ace({
      token: { correct: ACE_SERVER_TOKEN, req: body.token },
      options: { dir: ACE_DIRECTORY, env: ACE_ENVIRONMENT, req: body.req },
    })

    return json(res)
  } catch (e) {
    return json(e, { status: 500 })
  }
}) satisfies RequestHandler
