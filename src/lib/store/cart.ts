import { writable } from 'svelte/store'
import type { Cart, CartItem } from '$lib'
import { browser } from '$app/environment'


const defaultValue: Cart = []
const localValue = browser ? JSON.parse(window.localStorage.getItem('cart') || '[]') : defaultValue
export const cart = writable<Cart>(localValue || defaultValue)


cart.subscribe((c: Cart) => {
  if (browser) window.localStorage.setItem('cart', JSON.stringify(c))
})


export function set (c: Cart) {
  const cartMap: Map<string, CartItem> = new Map()

  for (const cartItem of c) {
    const key = `${ cartItem.productId }${ cartItem.size ? ':::' + cartItem.size : '' }`
    const value = cartMap.get(key)

    if (!value) cartMap.set(key, { ...cartItem, id: cartItem.id || crypto.randomUUID() })
    else {
      value.quantity += cartItem.quantity
      if (value.quantity > 27) value.quantity = 27 // max quantity is 27
      cartMap.set(key, value)
    }
  }

  cart.set([...cartMap.values()])
}
