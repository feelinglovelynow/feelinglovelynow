<script lang="ts">
  import Head from '$lib/components/Head.svelte'

  function sendTestEmail () {
    fetch('/test/email')
  }
</script>


<Head title="Test Email" url="admin" />
<button type="button" on:click={ sendTestEmail }>Send Test Email</button>
