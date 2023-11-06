import send from '$lib/mailchannels/send'
import type { Cookies } from '@sveltejs/kit'
import { enumTokenType } from '$lib/util/enums'
import createToken from '$lib/auth/createToken'
import setSignInCookie from '$lib/auth/setSignInCookie'
import IMG_EMAIL_HEAD from '$lib/img/email/IMG_EMAIL_HEAD.png'
import { PUBLIC_ENVIRONMENT, PUBLIC_HOST } from '$env/static/public'


export default async function sendSignInEmailAndSetCookie (cookies: Cookies, userId: string, email: string, firstName?: string): Promise<string | undefined> {
  const signInId = crypto.randomUUID() // sign in id will be in the token & in the cookie
  const token = await createToken(enumTokenType.SIGN_IN, { userId, signInId }) // create token to place in sign in email
  const href = `${ PUBLIC_HOST }/auth/verify-token?token=${ token }`

  setSignInCookie(signInId, cookies)

  if (PUBLIC_ENVIRONMENT === 'local') return href // so we may click the link w/in the email locally, b/c emails do not work outside of cloudflare workers (aka locally)
  else await sendEmail(href, email, firstName)
}


async function sendEmail (href: string, email: string, firstName?: string) {
  const visibleHref = href
    .replace('ht', '<span>ht</span>')
    .replace(':/', '<span>:/</span>')
    .replace('.co', '<span>.co</span>')

    await send({
      to: email, 
      subject: `Feeling Lovely Now sign in link${ firstName ? ' for ' + firstName : '' }!`,
      content: `
        <table style="padding: 18px 18px 27px 18px; color: #273142; table-layout: fixed; width: 100%; max-width: 100vw; font-size: 16px; text-align:center; background-color:#f9f5f2; font-family: Inter, ui-sans-serif, system-ui;">
          <tr>
            <td>
              <img style="margin-bottom: 6px; width: 280px; padding-right: 9px;" src="https://feelinglovelynow.com${ IMG_EMAIL_HEAD }" alt="logo" />
              <div style="color: #273142; font-size:27px; margin-bottom: 9px; font-family: papyrus, Inter, ui-sans-serif, system-ui;">Welcome${ firstName ? ' ' + firstName : ''}!</div>
              <div style="margin-bottom: 9px;"><a href="${ href }" target="_blank" style="text-underline-offset: 4.5px;">🔮 Please click this link to sign in to Feeling Lovely Now!</a></div>
              <div style="color: #273142; margin-bottom: 9px;">🕰 This link is valid for <strong>9 minutes</strong></div>
              <div style="color: #273142; margin-bottom: 9px;">🙏 This link must be clicked from the <strong>same computer and browser</strong> that filled out the sign in form</div>
              <div style="color: #273142; margin-bottom: 9px;">🌈 Here is the link in plain text if you would love to <strong>copy and paste it</strong></div>
              <div style="color: #273142; word-wrap: anywhere;">${ visibleHref }</div>
              <div style"display: none">${ crypto.randomUUID() }</div>
            </td>
          </tr>
        </table>
      `,
    })
}