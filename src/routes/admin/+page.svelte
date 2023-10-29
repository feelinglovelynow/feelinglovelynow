<script lang="ts">
  import type { Product } from '$lib'
  import Price from '$lib/store/Price'
  import type { PageData } from './$types'
  import { Slug } from '@sensethenlove/slug'
  import showToast from '@sensethenlove/toast'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import { PUBLIC_ENVIRONMENT } from '$env/static/public'
  import Button from '$lib/components/forms/Button.svelte'
  import SVG_CHEVRON_RIGHT from '$lib/svg/SVG_CHEVRON_RIGHT.svg'

  export let data: PageData

  const isLoading = {
    search: false,
    library: false,
    products: false,
  }

  $: if (data.orders && data.products) {
    const mapProducts = new Map<string, Product>()

    for (const product of data.products) {
      mapProducts.set(product.id, product)
    }

    for (const order of data.orders) {
      for (const orderItem of order.orderItems) {
        if (orderItem.product) orderItem.product.primaryImage.src = mapProducts.get(orderItem.product.id)?.primaryImage.src
      }
    }
  }

  async function dgraphToKV (key: 'library' | 'products', url: string) {
    isLoading[key] = true
    const fetchResponse = await fetch(url)
    const response = await fetchResponse.json()
    isLoading[key] = false

    if (response?._errors?.length) showToast({ type: 'info', items: response._errors })
    else showToast({ type: 'success', items: [ 'Success!' ] })
  }

  async function searchOrders () {
    isLoading.search = true
    const fetchResponse = await fetch('/admin/search-orders', {
      method: 'POST',
      body: JSON.stringify(data.search),
      headers: { 'Content-Type': 'application/json' }
    })
    data.orders = await fetchResponse.json()
    isLoading.search = false
  }
</script>


{ #if PUBLIC_ENVIRONMENT === 'local' }
  <Head title="Admin" />
  <Title text="Welcome Admin!" />

  <div class="wrapper">
    <!-- Cache -->
    <div class="cache flex-center">
      <Title noBottom={ true } text="Cache" />
      <section>
        <Button
          text="Dgraph Library to KV"
          isLoading={ isLoading.library }
          onClick={ () => dgraphToKV('library', '/admin/dgraph-library-to-kv') } />

        <Button
          text="Dgraph Products to KV"
          isLoading={ isLoading.products }
          onClick={ () => dgraphToKV('products', '/admin/dgraph-products-to-kv') } />
      </section>
    </div>

    <!-- Orders -->
    <div class="orders-table">
      <div class="flex-center">
        <Title noBottom={ true } text="Orders" />
      </div>
      <section>
        { #if data.search }
          <form class="search-form">
            <div class="form-item">
              <label for="">Order ID</label>
              <input bind:value={ data.search.orderId } disabled={ Boolean(data.search.email) } type="text" class="brand">
            </div>
            <div class="form-item">
              <label for="">Email</label>
              <input bind:value={ data.search.email } disabled={ Boolean(data.search.orderId) } type="text" class="brand">
            </div>
            <div class="form-item">
              <label for="">Start</label>
              <input bind:value={ data.search.startDate } disabled={ Boolean(data.search.orderId || data.search.email) } type="datetime-local" class="brand">
            </div>
            <div class="form-item">
              <label for="">End</label>
              <input bind:value={ data.search.endDate } disabled={ Boolean(data.search.orderId || data.search.email) } type="datetime-local" class="brand">
            </div>

            <Button onClick={ searchOrders } css="brand" type="button" text="Search" isLoading={ isLoading.search } />
          </form>
        { /if }

        { #if data.orders?.length }
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
                  <td>{ (new Date(order.createdAt)).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Los_Angeles' }) }</td>
                  <td class="right">${ (new Price(order.totalPrice)).str }</td>
                </tr>
                { #if order.isOpen }
                  <tr class="bottom-row">
                    <td></td>
                    <td colspan="5">
                      <div class="orders-shipping-forms">
                        <div>
                          <div class="papyrus">Order Items</div>
                          { #each order.orderItems as orderItem }
                            <div class="order">
                              <div class="img">
                                <img src={ orderItem.product?.primaryImage.src } alt={ orderItem.product?.name }>
                              </div>
                              <div class="info">
                                <div class="info-item">{ orderItem.product?.name }</div>
                                <div class="info-item">ID: { orderItem.id }</div>
                                <div class="info-item">Quantity: { orderItem.quantity } { #if orderItem.size }⋅ Size: { orderItem.size }{ /if }</div>
                                <div>Shipping Details: Not Shipped Yet</div>
                              </div>
                            </div>
                          { /each }
                        </div>
                        <div class="shipping-forms">
                          <div class="shipping">
                            <div class="papyrus">Shipping Address</div>
                            <div>{ order.name }</div>
                            <div>{ order.addressLine1 }</div>
                            { #if order.addressLine2 }
                              <div>{ order.addressLine2 }</div>
                            { /if }
                            <div>{ order.city } { order.state } { order.zip } { order.country }</div>
                          </div>

                          <div class="forms">
                            <div class="papyrus">Set Shipping Tracking</div>
                            { #each order.orderItems as orderItem }
                              <label class="switch-wrapper">
                                <div class="switch">
                                  <input type="checkbox">
                                  <span class="slider"></span>
                                </div>
                                <div class="text">{ orderItem.id }</div>
                              </label>
                            { /each }
                            <div class="input-button">
                              <input type="text" class="brand tracking-number" placeholder="Tracking Number">
                              <select class="brand shipping-company">
                                <option value="" disabled>Company Shipping Products</option>
                                <option value="USPS">USPS</option>
                                <option value="UPS">UPS</option>
                                <option value="DHL">DHL</option>
                              </select>
                              <Button text="Save" type="button" css="brand" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                { /if }
              { /each }
            </tbody>
          </table>
        { /if }
      </section>
    </div>


    <!-- Slug -->
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
      table {
        width: 100%;
      }

      section {
        overflow: auto;
        text-align: left;

        .search-form {
          display: flex;
          align-items: end;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          min-width: 100%;

          .form-item {
            margin: 0 0.9rem 0 0;

            label {
              white-space: nowrap;
            }

            input {
              width: 24rem;
            }
          }
        }


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
          tr {
            &:last-child {
              td {
                padding-bottom: 0;
              }
            }
            &.top-row {
              td {
                white-space: nowrap;
                vertical-align: middle;
                transition: all $theme-swap-speed;
                border-top: 1px solid var(--border-color);

                .toggle-wrapper {
                  display: flex;
                  align-items: center;
                  height: 4.2rem;

                  .toggle {
                    padding: 0;
                    height: 3.2rem;
                    width: 3.2rem;
                    border-radius: 50%;
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
            &.bottom-row {
              padding-bottom: 1.5rem;

              .orders-shipping-forms {
                display: flex;
                justify-content: space-between;
                padding: 0.9rem 0 1.5rem 0;

                .shipping-forms {
                  text-align: right;
                  padding-left: 4.5rem;

                  .shipping {
                    padding-bottom: 1.5rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border-color-light);
                  }

                  .forms {
                    .switch-wrapper {

                      .text {
                        white-space: nowrap;
                      }
                    }

                    .input-button {
                      input,
                      select {
                        display: inline-block;
                        margin-right: 0.9rem;
                      }

                      .tracking-number {
                        width: 24rem;
                      }

                      .shipping-company {
                        width: 9rem;
                      }
                    }
                  }
                }

                .order {
                  display: flex;
                  padding-bottom: 0.6rem;
                  margin-bottom: 0.6rem;
                  transition: all $theme-swap-speed;
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

                  .info {
                    font-size: 1.5rem;

                    .info-item {
                      margin-bottom: 0.3rem;
                      &:first-child { // product name
                        max-width: 45rem;
                        font-weight: 500;
                        white-space: nowrap;
                        overflow: auto;
                      }
                    }
                  }
                }
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
