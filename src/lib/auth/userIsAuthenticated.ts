import { redirect } from '@sveltejs/kit'


export default function userIsAuthenticated (locals: App.Locals) {
  if (locals.userId) return true
  else redirect(302, '/auth/sign-in')
}
