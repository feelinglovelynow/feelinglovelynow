import { redirect } from '$lib/global/svelte-catch'


export default function userIsNotAuthenticated (locals: App.Locals) {
  if (!locals.userUid) return true
  else throw redirect('/admin')
}
