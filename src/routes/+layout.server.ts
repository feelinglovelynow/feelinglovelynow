import get from '$lib/kv/get'
import type { Cookies } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import setThemeCookie from '$lib/theme/setThemeCookie'
import serverPageCatch from '$lib/catch/serverPageCatch'
import type { Source, Product, Category, Theme } from '$lib'


export const load = (async ({ platform, cookies, locals }) => {
  try {
    const theme = doTheme(cookies)
    const { sources, products, productCategories } = await doKV(platform)
    return { locals, theme, sources, products, productCategories }
  } catch (e) {
    return serverPageCatch(e)
  }
}) satisfies LayoutServerLoad


function doTheme (cookies: Cookies) {
  const DEFAULT_THEME = 'dark'
  const COOKIE_THEME = cookies.get('fln__theme')
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
      mapCategories.set(category.slug, category)
    }
  }

  return {
    sources: sources as Source[],
    products: products as Product[],
    productCategories: [...mapCategories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)) // sort categories by name
  }
}
