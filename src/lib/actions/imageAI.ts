import schema from '$lib/zod/imageAI'
import type { Action } from '@sveltejs/kit'
import actionCatch from '$lib/catch/actionCatch'
import validateFields from '$lib/form/validateFields'
import { OPEN_AI_SECRET_KEY } from '$env/static/private'


export default (async ({ request }) => {
  try {
    const fields = Object.fromEntries((await request.formData()).entries()) 
    await validateFields(fields, schema)

    const fetchResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPEN_AI_SECRET_KEY,
      },
      body: JSON.stringify({
        n: 1,
        size: '1024x1024',
        prompt: fields.description.toString(),
      }),
    })

    const response = await fetchResponse.json()
    console.log('response', response)
    return response.data[0].url
  } catch (e) {
    return actionCatch(e)
  }
}) satisfies Action
