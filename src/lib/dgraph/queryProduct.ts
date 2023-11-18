import type { Product } from '$lib'
import { txn, dgraph } from '$lib/dgraph/dgraph'


export default async function getProducts (): Promise<Product[]> {
  const transaction = await txn({ readOnly: true, pointMain: true }) // products are only in main db

  const r = await dgraph({ transaction, discardTxn: true, query: `
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
  `})

  return r?.data?.products as Product[]
}
