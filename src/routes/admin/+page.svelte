<script lang="ts">
  import { Slug } from '@sensethenlove/slug'
  import showToast from '@sensethenlove/toast'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Button from '$lib/components/forms/Button.svelte'
  import ImageAi from '$lib/components/forms/ImageAI.svelte'

  let isDgraphToKvLoading = {
    library: false,
    products: false,
  }

  async function dgraphToKV (key: 'library' | 'products', url: string) {
    isDgraphToKvLoading[key] = true
    const fetchResponse = await fetch(url)
    const response = await fetchResponse.json()
    isDgraphToKvLoading[key] = false

    if (response?._errors?.length) showToast({ type: 'info', items: response._errors })
    else showToast({ type: 'success', items: [ 'Success!' ] })
  }
</script>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Admin" url="admin" />
  <Title text="Welcome Admin!" />

  <div class="wrapper">
    <Button
      css="draph-kv-button"
      text="Dgraph Library to KV"
      isLoading={ isDgraphToKvLoading.library }
      onClick={ () => dgraphToKV('library', '/admin/dgraph-library-to-kv') } />

    <Button
      css="draph-kv-button"
      text="Dgraph Products to KV"
      isLoading={ isDgraphToKvLoading.products }
      onClick={ () => dgraphToKV('products', '/admin/dgraph-products-to-kv') } />

    <Title noBottom={ true } text="Generate Slug" />
    <section>
      <Slug />
    </section>
    <ImageAi />
  </div>
{ /if }


<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    :global(.draph-kv-button) {
      margin-bottom: 1.8rem;
    }

    :global(.draph-kv-button .text) {
      font-size: 1.71rem;
    }

    :global(.stl--slug) {
      margin-bottom: 1.5rem;
    }

    :global(.stl--slug div) {
      max-width: 270px;
      word-wrap: break-word;
      margin-top: 0.9rem;
      padding: 1.8rem;
      border-radius: 1.8rem;
      background-color: var(--opacity-bg);
    }
  }
</style>
