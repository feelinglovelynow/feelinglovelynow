<script lang="ts">
  import Price from '$lib/store/Price'
  import type { PageData } from './$types'
  import type { Order, Product } from '$lib'
  import Head from '$lib/global/Head.svelte'
  import Title from '$lib/global/Title.svelte'
  import Button from '$lib/form/Button.svelte'
  import { Slug } from '@feelinglovelynow/slug'
  import showToast from '@feelinglovelynow/toast'
  import toastRouteError from '$lib/catch/toastRouteError'
  import SVG_CHEVRON_RIGHT from '$lib/svg/SVG_CHEVRON_RIGHT.svg'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'
  import getShippingTrackingHref from '$lib/store/getShippingTrackingHref'
  import { enumOrderItemStatus, enumShippingCarrier } from '$lib/global/enums'

  export let data: PageData
  toastRouteError(data)

  const shippingCarriers = Object.values(enumShippingCarrier)
  const orderItemStatuses = Object.values(enumOrderItemStatus)

  const isLoading = {
    search: false,
    library: false,
    products: false,
    updateOrderItems: false,
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

    const rFetch = await fetch(url)
    const r = await rFetch.json()

    if (r?._errors?.length) showToast('info', r._errors)
    else showToast('success', 'Success!')

    isLoading[key] = false
  }


  async function searchOrders (index?: number) {
    isLoading.search = true

    const rFetch = await fetch('/admin/search-orders', {
      method: 'POST',
      body: JSON.stringify(data.search),
      headers: { 'Content-Type': 'application/json' }
    })

    const r = await rFetch.json()

    if (r?._errors?.length) showToast('info', r._errors)
    else if (typeof index === 'undefined') data.orders = r
    else {
      r[index].showOrderDetails = true
      data.orders = r
    }

    isLoading.search = false
  }


  async function updateOrderItems (order: Order, index: number) {
    isLoading.updateOrderItems = true

    const rFetch = await fetch('/admin/update-order-items', {
      method: 'POST',
      body: JSON.stringify(order),
      headers: { 'Content-Type': 'application/json' }
    })

    const r = await rFetch.json()

    if (r?._errors?.length) showToast('info', r._errors)
    else {
      await searchOrders(index)
      showToast('success', 'Success!')
    }

    isLoading.updateOrderItems = false
  }


  function toggleOrderDetails (e: { currentTarget: HTMLButtonElement }, order: Order) {
    if (order.showOrderDetails) { // IF order details are visible
      const button = e.currentTarget // toggle button that is clicked
      order.trOrderDetails?.classList.remove('visible') // slide order details closed
      button.classList.remove('is-open') // start the animation on the button b/c the order details is closing

      setTimeout(() => { // once order details closed
        order.showOrderDetails = false // update order object
        data.orders = data.orders // update orders array
      }, 900)
    } else { // IF order details are not visible
      order.showOrderDetails = true // update order object
      data.orders = data.orders // update orders array

      setTimeout(() => { // now that the element is in the DOM
        order.trOrderDetails?.classList.add('visible') // slide order details open
      }, 90)
    }
  }
</script>



<Head title="Admin" />

<main>
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

            <Button onClick={ () => searchOrders() } css="brand" type="button" text="Search" isLoading={ isLoading.search } />
          </form>
        { /if }

        { #if data.orders?.length }
          <table>
            <thead>
              <tr>
                <th class="button-cell"></th>
                <th>Order ID</th>
                <th>Email</th>
                <th>Created At</th>
                <th class="right">Total Price</th>
              </tr>
            </thead>
            <tbody>
              { #each data.orders as order, index (order.id) }
                <tr class="top-row">
                  <td>
                    <div class="toggle-wrapper">
                      <button on:click={ (e) => toggleOrderDetails(e, order) } class="brand toggle { order.showOrderDetails ? 'is-open': '' }">{ @html SVG_CHEVRON_RIGHT }</button>
                    </div>
                  </td>
                  <td>{ order.id }</td>
                  <td>{ order.email }</td>
                  <td>{ (new Date(order.createdAt)).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Los_Angeles' }) }</td>
                  <td class="right">${ (new Price(order.totalPrice)).str }</td>
                </tr>
                { #if order.showOrderDetails }
                  <tr class="order-details--tr" bind:this={ order.trOrderDetails }>
                    <td class="button-cell"></td>
                    <td colspan="4">
                      <div class="order-details--wrapper">
                        <div class="order-details">
                          <div class="order-items">
                            <div class="papyrus two">Order Items</div>

                            { #each order.orderItems as orderItem (orderItem.id) }
                              <div class="order-item">
                                <div class="img">
                                  <img src={ orderItem.product?.primaryImage.src } alt={ orderItem.product?.name }>
                                </div>
                                <div class="info">
                                  <div class="title">
                                    { #if orderItem.size }
                                      <span class="fln__pr-text">Size { orderItem.size } •</span>
                                    { /if }
                                    { #if (orderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER || orderItem.status === enumOrderItemStatus.DELIVERED_TO_CUSTOMER) && orderItem.shippingCarrier && orderItem.shippingTrackingId }
                                      <span class="fln__pr-text">
                                        <span class="fln__pr-text">Tracking ID:</span>
                                        <a class="fln__pr-text" target="_blank" href="{ getShippingTrackingHref(orderItem.shippingCarrier, orderItem.shippingTrackingId) }">{ orderItem.shippingTrackingId }</a>  
                                        <span class="fln__pr-text">•</span>
                                      </span>
                                    { /if }
                                    <span class="fln__pr-text">{ orderItem.product?.name }</span>
                                  </div>

                                  <div class="form top">
                                    <select bind:value={ orderItem.status } class="brand status">
                                      <option value="" disabled>Set Order Items Status</option>
                                      { #each orderItemStatuses as orderItemStatus (orderItemStatus) }
                                        <option value={ orderItemStatus }>{ orderItemStatus }</option>
                                      { /each }
                                    </select>

                                    <select bind:value={ orderItem.quantity } disabled={ orderItem.status !== enumOrderItemStatus.RETURN_REQUESTED } name="quantity" class="brand quantity">
                                      <option value="" disabled>Quantity</option>
                                      { #each { length: 28 } as _, index }
                                        <option value={ index }>{ index }</option>
                                      { /each }
                                    </select>
                                  </div>

                                  { #if orderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER || orderItem.status === enumOrderItemStatus.DELIVERED_TO_CUSTOMER }
                                    <div class="form">
                                      <input bind:value={ orderItem.shippingTrackingId } type="text" class="brand" placeholder="Tracking ID">
                                      <select bind:value={ orderItem.shippingCarrier } class="brand shipping-carrier">
                                        <option disabled value="">Carrier</option>
                                        { #each shippingCarriers as shippingCarrier (shippingCarrier) }
                                          <option value={ shippingCarrier }>{ shippingCarrier }</option>
                                        { /each }
                                      </select>
                                    </div>
                                  { /if }

                                  { #if orderItem.status === enumOrderItemStatus.RETURN_REQUESTED || orderItem.status === enumOrderItemStatus.REFUND_MONEY_PROCESSING || orderItem.status === enumOrderItemStatus.REFUNDED }
                                    <div class="form">
                                      <input bind:value={ orderItem.refundAmount } disabled={ orderItem.status === enumOrderItemStatus.REFUND_MONEY_PROCESSING || orderItem.status === enumOrderItemStatus.REFUNDED } type="number" class="brand" placeholder="Refund Amount">
                                    </div>
                                  { /if }
                                </div>
                              </div>
                            { /each }

                            <Button onClick={ () => updateOrderItems(order, index) } isLoading={ isLoading.updateOrderItems } text="Save" type="button" />
                          </div>

                          <div class="shipping">
                            <div class="papyrus two">Shipping Address</div>
                            <div>{ order.name }</div>
                            <div>{ order.addressLine1 }</div>
                            { #if order.addressLine2 }
                              <div>{ order.addressLine2 }</div>
                            { /if }
                            <div>{ order.city } { order.state } { order.zip } { order.country }</div>
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

  <section>
    <LoadingAnchor href="/auth/sign-out" label="Sign Out" />
  </section>
</main>


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
      $order-details-transition-speed: 0.9s;

      table {
        width: 100%;
        min-width: 108rem;
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
          &.right {
            text-align: right;
          }
          &.button-cell {
            width: 4.1rem;
          }
        }

        th {
          padding: 0.45rem;
          white-space: nowrap;
        }

        tbody {
          tr {
            transition: all $order-details-transition-speed;
            &:last-child {
              td {
                padding-bottom: 0;
              }
            }
            &.top-row {
              td {
                padding: 0.45rem;
                white-space: nowrap;
                vertical-align: middle;
                transition: border-top $theme-swap-speed;
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
                      transition: all $order-details-transition-speed;
                    }
                  }
                }
              }
            }
            &.order-details--tr {
              transition: all $order-details-transition-speed;
              &:global(.visible) {
                padding-bottom: 1.5rem;
              }
              &:global(.visible .order-details--wrapper) {
                grid-template-rows: 1fr;
              }
              &:global(.visible .order-details) {
                padding: 0.45rem 0 2.7rem 0 !important;
              }

              td {
                padding: 0;
              }

              .order-details--wrapper {
                display: grid;
                grid-template-rows: 0fr;
                transition: all $order-details-transition-speed;

                .order-details {
                  padding: 0;
                  display: flex;
                  justify-content: space-between;
                  overflow: hidden;
                  transition: all $order-details-transition-speed;

                  .shipping {
                    text-align: right;
                    padding-right: 0.45rem;
                  }

                  .order-items {
                    flex: auto;
                    max-width: 75rem;
                    margin-right: 1.8rem;
                    padding-right: 1.8rem;
                    border-right: 0.12rem solid var(--border-color-light);

                    .order-item {
                      display: flex;
                      margin-bottom: 1.8rem;
                      transition: all $theme-swap-speed;
                      &:last-child {
                        border: none;
                      }

                      .img {
                        width: 13.2rem;
                        min-width: 13.2rem;
                        margin-right: 0.9rem;

                        img {
                          width: 100%;
                        }
                      }

                      .info {
                        margin-right: 2.1rem;
                        transform: translateY(-0.45rem);

                        .title {
                          width: 100%;
                          font-weight: 500;
                          margin-bottom: 1.2rem;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          overflow: auto;
                          max-width: 58rem;
                          font-size: 2.1rem;
                        }

                        .form {
                          display: flex;
                          justify-content: start;
                          align-items: center;
                          &.top {
                            margin-bottom: 1.2rem;
                          }

                          input,
                          select {
                            height: 3.9rem;
                          }

                          input {
                            width: 28.2rem;
                            margin-right: 1.8rem;
                          }

                          select {
                            &.status {
                              width: 28.2rem;
                              margin-right: 1.8rem;
                            }
                            &.quantity,
                            &.shipping-carrier {
                              width: 9rem;
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
        }
      }
    }

    .slug {

      :global(.fln__slug) {
        margin-bottom: 1.5rem;
      }

      :global(.fln__slug div) {
        max-width: 270px;
        word-wrap: break-word;
        margin-top: 2.1rem;
        border-radius: 1.8rem;
      }

      :global(.fln__slug textarea) {
        transition: all $theme-swap-speed;
        appearance: none;
        background-color: var(--input-bg-color);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        line-height: 1.32;
        padding: 0.8rem;
        font-size: 1.6rem;
      }

      :global(.fln__slug textarea:focus) {
        outline: 0;
        border-color: transparent;
        box-shadow: var(--focus-box-shadow);
      }
    }    
  }
</style>
