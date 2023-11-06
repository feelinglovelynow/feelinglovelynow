import { redirect } from '$lib/catch/error'


export default function userIsNotAuthenticated (locals: App.Locals) {
  if (!locals.userId) return true
  else throw redirect('/admin')
}
