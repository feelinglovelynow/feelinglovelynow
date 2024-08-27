<script lang="ts">
  import type { PageData } from './$types'
  import Hero from '$lib/global/Hero.svelte'
  import SignIn from '$lib/form/SignIn.svelte'
  import { routeCatch } from '$lib/global/catch'

  export let data: PageData
  routeCatch(data)
</script>


<main>
  <SignIn />
  <Hero count={ 1 } isAbsolute={ true } showContent={ false } showDown={ false }/>
</main>
