import { writable, type Writable } from 'svelte/store'
import type { Theme } from '$lib/theme/theme'


export const theme: Writable<Theme> = writable('dark')
