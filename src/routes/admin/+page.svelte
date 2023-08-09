<script lang="ts">
  import { Slug } from '@sensethenlove/slug'
  import showToast from '@sensethenlove/toast'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Button from '$lib/components/forms/Button.svelte'

  let isDgraphToKVLoading = false

  async function dgraphToKV () {
    isDgraphToKVLoading = true
    const fetchResponse = await fetch('/admin/dgraph-to-kv')
    const response = await fetchResponse.json()
    isDgraphToKVLoading = false

    if (response?._errors?.length) showToast({ type: 'info', items: response._errors })
    else showToast({ type: 'success', items: [ 'Success!' ] })
  }
</script>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Admin" url="admin" />
  <Title text="Welcome Admin!" />

  <div class="wrapper">
    <Button css="draph-to-kv-button" onClick={ dgraphToKV } isLoading={ isDgraphToKVLoading } text="Dgraph to KV" />
    <div class="slug-label">Generate Slug</div>
    <Slug />
  </div>
{ /if }


<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    :global(.draph-to-kv-button) {
      margin-bottom: 1.8rem;
    }

    .slug-label {
      font-weight: 500;
    }

    :global(.stl--slug div) {
      max-width: 270px;
      word-wrap: break-word;
      margin-top: 0.9rem;
    }
  }
</style>
