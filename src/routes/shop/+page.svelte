<script lang="ts">
  import { onMount } from 'svelte'
  // import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import SocialSupport from '$lib/components/SocialSupport.svelte'

  // export let data: PageData

  let scriptElement: HTMLScriptElement

  onMount(() => {
    // scriptElement.addEventListener('load', async () => {
    //   if (data.braintree && (window as any).braintree) {
    //     const dropinInstance = await (window as any).braintree.dropin.create({
    //       authorization: data.braintree,
    //       container: document.getElementById('dropin-container'),
    //     })

    //     console.log('dropinInstance', dropinInstance)
    //   }
    // })

    // scriptElement.setAttribute('src', 'https://js.braintreegateway.com/web/dropin/1.40.2/js/dropin.min.js')
  })
</script>

<svelte:head>
   <script bind:this={ scriptElement }></script>
</svelte:head>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Shop" url="shop" description="Purchase products" />
  <Title text="Shop" size="two" />
  <SocialSupport />
  <div id="dropin-container"></div>
{ /if }


<style lang="scss">
  
</style>
