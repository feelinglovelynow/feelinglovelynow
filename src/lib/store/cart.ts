import type { Cart } from '$lib'
import { writable } from 'svelte/store'
import { browser } from '$app/environment'

const defaultValue: Cart = []
const localValue = browser ? JSON.parse(window.localStorage.getItem('cart') || '[]') : defaultValue
const cart = writable<Cart>(localValue || defaultValue )
 
cart.subscribe((c: Cart) => {
  if (browser) window.localStorage.setItem('cart', JSON.stringify(c))
})
 
export default cart
