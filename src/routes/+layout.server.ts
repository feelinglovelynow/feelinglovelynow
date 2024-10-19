import { ace, td } from '@ace/db'
import type { Product } from '$lib'
import { seed } from '$lib/global/seed'
import type { LayoutServerLoad } from './$types'
import { pageServerCatch } from '$lib/global/catch'
import { ACE_CRYPT_IV, ACE_CRYPT_JWK, ACE_DIRECTORY, ACE_ENVIRONMENT } from '$env/static/private'


export const load = (async ({ locals }): Promise<{ locals: App.Locals, products: Product[]}> => {
  try {
    const products = await getProducts()

    await bindImages(products)

    return { locals, products }
  } catch (e) {
    return pageServerCatch(e)
  }
}) satisfies LayoutServerLoad


async function getProducts () {
  const req: td.AceFnRequest = []

  seed(req)

  req.push({
    do: 'NodeQuery',
    how: {
      node: 'Product',
      resKey: 'products',
      resValue: {
        id: true,
        name: true,
        price: true,
        highPrice: true,
        displayOrder: true,
        image: {
          id: true,
          extension: true,
        }
      }
    }
  })

  const { products } = await ace({
    req,
    dir: ACE_DIRECTORY,
    env: ACE_ENVIRONMENT,
    ivs: { crypt: ACE_CRYPT_IV },
    jwks: { crypt: { type: 'crypt', jwk: ACE_CRYPT_JWK } },
  })

  return products as Product[]
}


async function bindImages (products: Product[]) {
  for (const product of products) {
    if (product.image) {
      product.image.src = (await import(`../lib/img/store/${ product.image.id }.${ product.image.extension }`)).default
    }
  }
}
