import type { Theme } from '$lib/theme/theme.d'
import { writable, type Writable } from 'svelte/store'


export const theme: Writable<Theme> = writable('dark')
