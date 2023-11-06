<script lang="ts">
  import type { PageData } from './$types'
  import toastRouteError from '$lib/util/toastRouteError'

  export let data: PageData
  toastRouteError(data)
</script>
