import { enumTheme } from '$lib/global/enums'
import { writable, type Writable } from 'svelte/store'


export const theme: Writable<enumTheme> = writable(enumTheme.dark)
