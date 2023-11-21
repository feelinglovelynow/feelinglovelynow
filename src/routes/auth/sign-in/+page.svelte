<script lang="ts">
  import type { PageData } from './$types'
  import SignIn from '$lib/form/SignIn.svelte'
  import { routeCatch } from '$lib/global/catch'

  export let data: PageData
  routeCatch(data)
</script>


<main>
  <SignIn />
</main>
