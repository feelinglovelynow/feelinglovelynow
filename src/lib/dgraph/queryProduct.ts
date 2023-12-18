import type { Product } from '$lib'
import txnOptions from '$lib/dgraph/txnOptions'
import { DgraphTransaction } from '@feelinglovelynow/dgraph'


export default async function queryProduct (): Promise<Product[]> {
  const transaction = new DgraphTransaction({ ...txnOptions(true), readOnly: true }) // products are only in main db

  const r = await transaction.query(true, `
    query {
      products(func: type(Product)) {
        uid
        name: Product.name
        price: Product.price
        featuredDisplayOrder: Product.featuredDisplayOrder
        storeDisplayOrder: Product.storeDisplayOrder
        slug: Product.slug
        description: Product.description
        primaryImage: Product.primaryImage {
          uid
          extension: Image.extension
        }
        categories: Product.categories {
          name: Category.name
          slug: Category.slug
        }
        similarProducts: Product.similarProducts {
          uid
        }
      }
    }
  `)

  return r?.data?.products as Product[]
}
