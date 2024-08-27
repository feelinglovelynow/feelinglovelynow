import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
// import {} from './.ace'
/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    version: {
      pollInterval: 180000 // send request to server for current app version every 3 minutes, helps w/ +layout.svelte > $app/stores > updated
    },
    csp: {
      mode: 'auto',
      directives: {
        'base-uri': [ 'self' ],
        'object-src': [ 'none' ],
        'script-src': [ 'strict-dynamic' ],
        'frame-src': [
          'https://www.paypal.com',
          'https://checkout.paypal.com',
          'https://www.sandbox.paypal.com',
          'https://w.soundcloud.com/player/',
          'https://www.youtube-nocookie.com',
          'https://challenges.cloudflare.com',
          'https://assets.braintreegateway.com',
        ],
      }
    }
  }
}
