<script lang="ts">
  import type { PageData } from './$types'
  import SignIn from '$lib/form/SignIn.svelte'
  import toastRouteError from '$lib/catch/toastRouteError'

  export let data: PageData
  toastRouteError(data)
</script>


<main>
  <SignIn />
</main>
