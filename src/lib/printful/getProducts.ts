import type { PrintfulProducts } from '$lib'
import { PRINTFUL_API_TOKEN } from '$env/static/private'


export default async function getProducts (): Promise<PrintfulProducts> {
  const rFetch = await fetch('https://api.printful.com/store/products', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ PRINTFUL_API_TOKEN }`,
    }
  })

  return await rFetch.json() as PrintfulProducts
}
