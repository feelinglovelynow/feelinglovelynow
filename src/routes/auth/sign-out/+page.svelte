<script lang="ts">
  import type { PageData } from './$types'
  import toastRouteError from '$lib/catch/toastRouteError'

  export let data: PageData
  toastRouteError(data)
</script>
