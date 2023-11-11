import { DKIM_PRIVATE_KEY } from '$env/static/private'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'


export default async function send ({ to, subject, content }: { to: string, subject: string, content: string }): Promise<number> {
  if (PUBLIC_ENVIRONMENT === 'local') return Promise.resolve(200)
  else {
    const rFetch = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        subject,
        content: [{ type: 'text/html', value: content }],
        from: { name: 'Feeling Lovely Now', email: 'us@feelinglovelynow.com' },
        personalizations: [{
          to: [ { email: to } ],
          dkim_selector: "mcdkim",
          dkim_private_key: DKIM_PRIVATE_KEY,
          dkim_domain: 'feelinglovelynow.com',
        }],
      }),
    })

    return rFetch.status
  }
}
