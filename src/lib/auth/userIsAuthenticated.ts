import { redirect } from '$lib/catch/error'


export default function userIsAuthenticated (locals: App.Locals) {
  if (locals.userId) return true
  else throw redirect('/auth/sign-in')
}
