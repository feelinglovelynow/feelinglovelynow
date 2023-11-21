import { redirect } from '$lib/global/svelte-catch'


export default function userIsAuthenticated (locals: App.Locals) {
  if (locals.userUid) return true
  else throw redirect('/auth/sign-in')
}
