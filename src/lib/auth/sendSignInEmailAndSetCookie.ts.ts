import type { Cookies } from '@sveltejs/kit'
import createToken from '$lib/auth/createToken'
import { PUBLIC_HOST } from '$env/static/public'
import { enumTokenType } from '$lib/global/enums'
import setSignInCookie from '$lib/auth/setSignInCookie'
import IMG_EMAIL_HEAD from '$lib/img/email/IMG_EMAIL_HEAD.png'
import { MAILJET_API_KEY, MAILJET_SECRET_KEY } from '$env/static/private'


export default async function sendSignInEmailAndSetCookie (cookies: Cookies, userId: number, email: string, firstName?: string): Promise<string | void> {
  const signInId = crypto.randomUUID() // sign in id will be in the token & in the cookie
  const token = await createToken(enumTokenType.SIGN_IN, { userId, signInId }) // create token to place in sign in email
  const href = `${ PUBLIC_HOST }/auth/verify-token?token=${ token }`

  setSignInCookie(signInId, cookies)
  await sendEmail(href, email, firstName)
}


async function sendEmail (href: string, email: string, firstName?: string) {
  const visibleHref = href
    .replace('ht', '<span>ht</span>')
    .replace(':/', '<span>:/</span>')
    .replace('.co', '<span>.co</span>')


    await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${ MAILJET_API_KEY }:${ MAILJET_SECRET_KEY }`).toString('base64'),
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: 'us@feelinglovelynow.com',
              Name: 'Feeling Lovely Now',
            },
            To: [
              {
                Email: email,
                Name: firstName,
              }
            ],
            Subject: `Feeling Lovely Now sign in link${ firstName ? ' for ' + firstName : '' }!`,
            HTMLPart: `
              <table style="padding: 18px 18px 27px 18px; color: #273142; table-layout: fixed; width: 100%; max-width: 100vw; font-size: 16px; text-align:center; font-family: Inter, ui-sans-serif, system-ui;">
                <tr> 
                  <td>
                    <img style="margin-bottom: 6px; width: 280px; padding-right: 9px;" src="https://feelinglovelynow.com${ IMG_EMAIL_HEAD }" alt="logo" />
                    <div style="color: #273142; font-size:24px; margin-bottom: 9px; font-family: papyrus, Inter, ui-sans-serif, system-ui;">Welcome${ firstName ? ' ' + firstName : ''}!</div>
                    <div style="font-size: 18px; margin-bottom: 9px;"><a href="${ href }" target="_blank" style="text-underline-offset: 4.5px;">🔮 Please click this link to sign in to Feeling Lovely Now!</a></div>
                    <div style="font-size: 18px; color: #273142; margin-bottom: 9px;">🕰 This link is valid for <strong>9 minutes</strong></div>
                    <div style="font-size: 18px; color: #273142; margin-bottom: 9px;">🙏 This link must be clicked from the <strong>same computer and browser</strong> that filled out the sign in form</div>
                    <div style="font-size: 18px; color: #273142; margin-bottom: 9px;">💚 Here is the link in plain text if you would love to <strong>copy and paste it</strong></div>
                    <div style="color: #273142; word-wrap: anywhere;">${ visibleHref }</div>
                  </td>
                </tr>
              </table>
            `
          }
        ]
      })
    })
}