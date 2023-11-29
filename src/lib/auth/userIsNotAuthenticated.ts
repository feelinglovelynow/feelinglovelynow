import { redirect } from '@sveltejs/kit'


export default function userIsNotAuthenticated (locals: App.Locals) {
  if (!locals.userUid) return true
  else throw redirect(302, '/admin')
}
