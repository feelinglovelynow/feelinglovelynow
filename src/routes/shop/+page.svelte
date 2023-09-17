<script lang="ts">
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Braintree from '$lib/components/forms/Braintree.svelte'

</script>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Shop" url="shop" description="Purchase products" />
  <Title text="Shop" size="two" />
  <Braintree />
{ /if }
