import { redirect } from '@sveltejs/kit'


export default function userIsAuthenticated (locals: App.Locals) {
  if (locals.userUid) return true
  else throw redirect(302, '/auth/sign-in')
}
