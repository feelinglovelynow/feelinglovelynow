import type { Product } from '$lib'


export default function sortFeaturedProducts (products: Product[]): Product[] {
  const featuredProducts = []

  for (const product of products) {
    if (Number.isInteger(product.featuredDisplayOrder)) featuredProducts.push(product)
  }

  return featuredProducts.sort((a, b) => Number(a.featuredDisplayOrder > b.featuredDisplayOrder) - Number(a.featuredDisplayOrder < b.featuredDisplayOrder)) // sort by featuredDisplayOrder
}
