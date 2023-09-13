<script lang="ts">
  import type { PageData } from './$types'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import SocialSupport from '$lib/components/SocialSupport.svelte'

  export let data: PageData
</script>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Shop" url="shop" description="Purchase products" />
  <Title text="Shop" size="two" />
  <SocialSupport />
  <div>{ JSON.stringify(data) }</div>
{ /if }


<style lang="scss">
  
</style>
