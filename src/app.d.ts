// See https://kit.svelte.dev/docs/types#app

import type { enumTheme } from '$lib/global/enums'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userUid?: any,
			theme: enumTheme
		}
		// interface PageData {}
		interface Platform {
			env: any
		}
	}
}

export {}
