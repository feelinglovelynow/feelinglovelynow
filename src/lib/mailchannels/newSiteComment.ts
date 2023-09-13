import type { FormFields } from '$lib'
import { DKIM_PRIVATE_KEY } from '$env/static/private'
import { PUBLIC_ENVIRONMENT } from '$env/static/public'


export default async function newSiteComment (fields: FormFields): Promise<string> {
  if (PUBLIC_ENVIRONMENT === 'local') return Promise.resolve('Success!')
  else {
    const fetchResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: ['us@feelinglovelynow.com'],
          dkim_selector: 'mailchannels',
          dkim_domain: 'feelinglovelynow.com',
          dkim_private_key: DKIM_PRIVATE_KEY
        }],
        from: {
          name: 'Feeling Lovely Now',
          email: 'us@feelinglovelynow.com',
        },
        subject: 'New Site Comment!',
        content: [{
          type: 'text/html',
          value: `
            <table style="padding: 18px 18px 27px 18px; color: #273142; table-layout: fixed; width: 100%; max-width: 100vw; font-size: 16px; text-align:center; background-color:#f9f5f2; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial;">
              <tr>
                <td>
                  <div style="color: #273142; font-size:27px; margin-bottom: 9px; font-family: papyrus, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial;">Feeling Lovely Now!</div>
                  <div>Hello world</div>
                  </td>
              </tr>
            </table>
          `,
        }],
      }),
    })

    return await fetchResponse.text()
  }
}
