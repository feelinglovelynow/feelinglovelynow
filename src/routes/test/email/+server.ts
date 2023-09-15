import { json, type RequestHandler } from '@sveltejs/kit'
import serverRequestCatch from '$lib/catch/serverRequestCatch'


export const GET = (async () => {
  try {
    const fetchResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                "email": "us@feelinglovelynow.com",
                "name": "Test Recipient"
              }
            ]
          }
        ],
        from: {
          name: 'Feeling Lovely Now',
          email: 'chris@feelinglovelynow.com',
        },
        subject: 'Test',
        content: [{
          type: 'text/plain',
          value: 'Test',
        }],
      }),
    })

    console.log(fetchResponse)
    const response = await fetchResponse.text()
    console.log(response)
    return json({ response })
  } catch (e) {
    return serverRequestCatch(e)
  }
}) satisfies RequestHandler
