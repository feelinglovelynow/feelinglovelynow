<script lang="ts">
  import type { PageData } from './$types'
  import { browser } from '$app/environment'
  import { Slug } from '@sensethenlove/slug'
  import showToast from '@sensethenlove/toast'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Button from '$lib/components/forms/Button.svelte'

  export let data: PageData

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
    <!-- Cache Buttons -->
    <div class="btn-wrapper">
      <Button
        text="Dgraph Library to KV"
        isLoading={ isDgraphToKvLoading.library }
        onClick={ () => dgraphToKV('library', '/admin/dgraph-library-to-kv') } />

      <Button
        text="Dgraph Products to KV"
        isLoading={ isDgraphToKvLoading.products }
        onClick={ () => dgraphToKV('products', '/admin/dgraph-products-to-kv') } />
    </div>

    <!-- Orders -->
    { #if browser && data.orders?.length }
      <section class="orders">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Created At</th>
              <th>Total Price</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>City</th>
              <th>Zip</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            { #each data.orders as order (order.id) }
              <tr>
                <td>{ order.id }</td>
                <td>{ new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' }) }</td>
                <td>${ order.totalPrice }</td>
                <td>{ order.name }</td>
                <td>{ order.email }</td>
                <td>{ order.addressLine1 }</td>
                <td>{ order.addressLine2 }</td>
                <td>{ order.city }</td>
                <td>{ order.zip }</td>
                <td>{ order.country }</td>
              </tr>
            { /each }
          </tbody>
        </table>
      </section>
    { /if }

    <!-- Generate Slug -->
    <div class="flex-center">
      <Title noBottom={ true } text="Generate Slug" />
      <section>
        <Slug />
      </section>
    </div>
  </div>
{ /if }


<style lang="scss">
  .flex-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .wrapper {
    max-width: 90vw;

    .orders {
      overflow: auto;
      text-align: left;

      th,
      td {
        white-space: nowrap;
        padding: 0 0.6rem 0.6rem 0.6rem;
      }
    }

    .btn-wrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.8rem;
      width: 100%;
      align-items: center;

      @media only screen and (min-width: 450px) { // big screen
        flex-direction: row;
        justify-content: center;
      }

      :global(button) {
        margin: 0.6rem;
        width: 24rem;
      }

      :global(.text) {
        font-size: 1.8rem;
        white-space: nowrap;
      }
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
