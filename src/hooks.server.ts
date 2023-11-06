import type { Handle } from '@sveltejs/kit'
import authHook from '$lib/auth/authHook'


export const handle = (async ({ event, resolve }) => {
  event = await authHook(event) // do auth stuff
  return resolve(event) // continue to down stream server code
}) satisfies Handle
