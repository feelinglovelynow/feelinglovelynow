<script lang="ts">
  import type { PageData } from './$types'
  import toastRouteError from '$lib/util/toastRouteError'
  import SignIn from '$lib/components/forms/SignIn.svelte'

  export let data: PageData
  toastRouteError(data)
</script>


<main>
  <SignIn />
</main>
