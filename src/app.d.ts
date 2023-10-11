// See https://kit.svelte.dev/docs/types#app

import type { Theme } from '$lib'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userId?: any,
			theme: Theme
		}
		// interface PageData {}
		interface Platform {
			env: any
		}
	}
}

export {};
