<script lang="ts">
  import type { PageData } from './$types'
  import { routeCatch } from '$lib/global/catch'

  export let data: PageData
  routeCatch(data)
</script>
