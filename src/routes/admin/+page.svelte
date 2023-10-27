<script lang="ts">
  import type { PageData } from './$types'
  import { Slug } from '@sensethenlove/slug'
  import showToast from '@sensethenlove/toast'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Button from '$lib/components/forms/Button.svelte'
  import SVG_CHEVRON_RIGHT from '$lib/svg/SVG_CHEVRON_RIGHT.svg'

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
    <div class="cache flex-center">
      <Title noBottom={ true } text="Cache" />
      <section>
        <Button
          text="Dgraph Library to KV"
          isLoading={ isDgraphToKvLoading.library }
          onClick={ () => dgraphToKV('library', '/admin/dgraph-library-to-kv') } />

        <Button
          text="Dgraph Products to KV"
          isLoading={ isDgraphToKvLoading.products }
          onClick={ () => dgraphToKV('products', '/admin/dgraph-products-to-kv') } />
      </section>
    </div>

    <!-- Orders -->
    { #if data.orders?.length }
      <div class="orders-table">
        <div class="flex-center">
          <Title noBottom={ true } text="Orders" />
        </div>
        <section>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Order ID</th>
                <th>Email</th>
                <th>Created At</th>
                <th class="right">Total Price</th>
              </tr>
            </thead>
            <tbody>
              { #each data.orders as order (order.id) }
                <tr class="top-row">
                  <td>
                    <div class="toggle-wrapper">
                      <button on:click={ () => order.isOpen = !order.isOpen} class="brand toggle { order.isOpen ? 'is-open': '' }">{ @html SVG_CHEVRON_RIGHT }</button>
                    </div>
                  </td>
                  <td>{ order.id }</td>
                  <td>{ order.email }</td>
                  <td>{ new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Los_Angeles' }) }</td>
                  <td class="right">${ order.totalPrice }</td>
                </tr>
                { #if order.isOpen }
                  <tr class="bottom-row">
                    <td></td>
                    <td colspan="5">
                      <div class="orders-shipping">
                        <div>
                          <div class="papyrus">Order Items</div>
                          { #each order.orderItems as orderItem }
                            <div class="order">
                              <div class="img">
                                <img src={ orderItem.product?.primaryImage.src } alt={ orderItem.product?.name }>
                              </div>
                              <div class="info">
                                <div class="product-name">{ orderItem.product?.name }</div>
                                <div class="order-id">{ orderItem.id }</div>
                                <div>Quantity: { orderItem.quantity } { #if orderItem.size }⋅ Size: { orderItem.size }{ /if }</div>
                              </div>
                            </div>
                          { /each }
                        </div>
                        <div class="shipping">
                          <div class="papyrus">Shipping</div>
                          <div>{ order.name }</div>
                          <div>{ order.addressLine1 }</div>
                          { #if order.addressLine2 }
                            <div>{ order.addressLine2 }</div>
                          { /if }
                          <div>{ order.city } { order.state } { order.zip } { order.country }</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                { /if }
              { /each }
            </tbody>
          </table>
        </section>
      </div>
    { /if }

    <!-- Generate Slug -->
    <div class="slug flex-center">
      <Title noBottom={ true } text="Slug" />
      <section>
        <Slug />
      </section>
    </div>
  </div>
{ /if }


<style lang="scss">
  @import '$lib/scss/variables';

  .wrapper {
    max-width: 90vw;

    .flex-center {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .cache {

      section {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.8rem;
        align-items: center;

        @media only screen and (min-width: 510px) { // big screen
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
    }

    .orders-table {
      section {
        overflow: auto;
        text-align: left;

        th,
        td {
          padding: 0.45rem;
          &.right {
            text-align: right;
          }
        }

        th {
          white-space: nowrap;
        }

        tbody {
          tr:last-child {
            td {
              padding-bottom: 0;
            }
          }

          .top-row {
            td {
              white-space: nowrap;
              vertical-align: middle;
              border-top: 1px solid var(--border-color);

              .toggle-wrapper {
                display: flex;
                align-items: center;
                height: 4.2rem;

                .toggle {
                  padding: 0;
                  height: 3.2rem;
                  width: 3.2rem;
                  &.is-open {
                    :global(svg) {
                      transform: rotate(450deg);
                    }
                  }

                  :global(svg) {
                    transition: all 0.54s;
                  }
                }
              }
            }
          }

          .orders-shipping {
            display: flex;
            justify-content: space-between;

            .shipping {
              text-align: right;
            }

            .order {
              display: flex;
              padding-bottom: 0.6rem;
              margin-bottom: 0.6rem;
              border-bottom: 1px solid var(--border-color-light);
              &:last-child {
                border: none;
              }

              .img {
                width: 9rem;
                margin-right: 0.9rem;

                img {
                  width: 100%;
                }
              }

              .order-id,
              .product-name {
                margin-bottom: 0.3rem;
              }

              .product-name {
                max-width: 45rem;
                font-weight: 500;
              }
            }
          }
        }
      }
    }

    .slug {

      :global(.stl--slug) {
        margin-bottom: 1.5rem;
      }

      :global(.stl--slug div) {
        max-width: 270px;
        word-wrap: break-word;
        margin-top: 2.1rem;
        border-radius: 1.8rem;
      }

      :global(.stl--slug textarea) {
        transition: all $theme-swap-speed;
        appearance: none;
        background-color: var(--input-bg-color);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        line-height: 1.32;
        padding: 0.8rem;
        font-size: 1.6rem;
      }

      :global(.stl--slug textarea:focus) {
        outline: 0;
        border-color: transparent;
        box-shadow: var(--focus-box-shadow);
      }
    }    
  }
</style>
