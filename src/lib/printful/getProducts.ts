import type { PrintfulProducts } from '$lib'
import { PRINTFUL_API_TOKEN } from '$env/static/private'


export default async function getProducts (): Promise<PrintfulProducts> {
  const fetchResponse = await fetch('https://api.printful.com/store/products', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ PRINTFUL_API_TOKEN }`,
    }
  })

  const jsonResponse: PrintfulProducts = await fetchResponse.json()
  return await jsonResponse
}
