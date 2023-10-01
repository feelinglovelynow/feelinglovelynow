import search from '$lib/actions/search'
import type { Actions, PageServerLoad } from './$types'
import serverPageCatch from '$lib/catch/serverPageCatch'
import { PRINTFUL_API_TOKEN } from '$env/static/private'


type PrintfulError = {
  reason: string,
  message: string
}


type PrintfulProducts = {
  code: number,
  error?: PrintfulError,
  result: string | {
    id: number,
    external_id: string,
    name: string,
    variants: number,
    synced: number,
    thumbnail_url: string,
    is_ignored: boolean
  }[],
}


type PageResponse = {
  products: {
    id: number,
    name: string,
    thumbnail: string
  }[]
}


export const load = (async () => {
  try {
    const response: PageResponse = { products: [] }

    const fetchResponse = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ PRINTFUL_API_TOKEN }`,
      }
    })

    const jsonResponse: PrintfulProducts = await fetchResponse.json()

    if (Array.isArray(jsonResponse?.result) && jsonResponse?.result.length) {
      for (const product of jsonResponse.result) {
        if (product.id !== 322540300 && product.id !== 322537696) {
          response.products.push({
            id: product.id,
            name: product.name,
            thumbnail: product.thumbnail_url
          })
        }
      }
    }

    console.log(response)
    return response
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies PageServerLoad


export const actions = {
  search
} satisfies Actions
