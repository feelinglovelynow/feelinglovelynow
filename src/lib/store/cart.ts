import { writable } from 'svelte/store'
import type { Cart, OrderItem } from '$lib'
import { browser } from '$app/environment'


const defaultValue: Cart = []
const localValue = browser ? JSON.parse(window.localStorage.getItem('cart') || '[]') : defaultValue
export const cart = writable<Cart>(localValue || defaultValue)


cart.subscribe((c: Cart) => {
  if (browser) window.localStorage.setItem('cart', JSON.stringify(c)) // put cart items into local storage
})


export function set (c: Cart) { // on set of the cart this function ensures the cart is formatted how we'd love (group similair products together, have a max on quantity)
  const cartMap: Map<string, OrderItem> = new Map() // helps us combine products in cart of a similair productUid and size

  for (const cartItem of c) {
    const key = `${ cartItem.productUid }${ cartItem.size ? ':::' + cartItem.size : '' }` // create a unique key for products in cart we'd love to group together
    const value = cartMap.get(key)

    if (!value) cartMap.set(key, { ...cartItem, uid: cartItem.uid || crypto.randomUUID() }) // if product is not in the map, add it in, uid helps w/ key @ DOM each block
    else { // if product is in the map
      value.quantity += cartItem.quantity // add together the quantity that is already in the map and the quantity that we are adding in
      if (value.quantity > 27) value.quantity = 27 // max quantity is 27
      cartMap.set(key, value) // put the updated quantity into the map
    }
  }

  cart.set([...cartMap.values()]) // convert cart map to array and add to store
}
