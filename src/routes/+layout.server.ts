import get from '$lib/kv/get'
import type { Cookies } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import type { Source, Product, Category, Theme } from '$lib'
import setThemeCookie from '$lib/cookies/setThemeCookie'


export const load = (async ({ platform, cookies }) => {
  const theme = doTheme(cookies)
  const { sources, products, productCategories } = await doKV(platform)
  return { theme, sources, products, productCategories }
}) satisfies LayoutServerLoad


function doTheme (cookies: Cookies) {
  const DEFAULT_THEME = 'dark'
  const COOKIE_THEME = cookies.get('theme')
  const theme: Theme = (COOKIE_THEME === 'light' || COOKIE_THEME === 'dark') ? COOKIE_THEME : DEFAULT_THEME

  if (!COOKIE_THEME) setThemeCookie(cookies, theme)

  return theme
}


async function doKV (platform: Readonly<App.Platform> | undefined) {
  const [ sources, products ] = await Promise.all([
    get('MAIN_CACHE', 'sources', platform),
    get('MAIN_CACHE', 'products', platform)
  ])

  const mapCategories: Map<string, Category> = new Map()

  const primaryImages = await Promise.all(products.map((product: Product) => {
    return import(`../lib/img/store/${ product.primaryImage.id }.${ product.primaryImage.extension }`)
  }))

  for (let i = 0; i < products.length; i++) {
    products[i].primaryImage.src = primaryImages[i].default

    for (const category of products[i].categories) {
      mapCategories.set(category.slug, category) // categories at the top of the page
    }
  }

  return {
    sources: sources as Source[],
    products: products as Product[],
    productCategories: [...mapCategories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)) // sort categories by name
  }
}