import { redirect } from '$lib/catch/error'


export default function userIsNotAuthenticated (locals: App.Locals) {
  if (!locals.userUid) return true
  else throw redirect('/admin')
}
