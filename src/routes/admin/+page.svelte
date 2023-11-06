<script lang="ts">
  import Price from '$lib/store/Price'
  import type { PageData } from './$types'
  import type { Order, Product } from '$lib'
  import { Slug } from '@feelinglovelynow/slug'
  import showToast from '@feelinglovelynow/toast'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import toastRouteError from '$lib/util/toastRouteError'
  import Button from '$lib/components/forms/Button.svelte'
  import SVG_CHEVRON_RIGHT from '$lib/svg/SVG_CHEVRON_RIGHT.svg'
  import { enumOrderItemStatus, enumShippingCarrier } from '$lib/util/enums'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor';

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
      r[index].isOpen = true
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
    if (order.isOpen) { // IF order details are visible
      const button = e.currentTarget // toggle button that is clicked
      order.trOrderDetails?.classList.remove('visible') // slide order details closed
      button.classList.remove('is-open') // start the animation on the button b/c the order details is closing

      setTimeout(() => { // once order details closed
        order.isOpen = false // update order object
        data.orders = data.orders // update orders array
      }, 900)
    } else { // IF order details are not visible
      order.shippingTrackingId = order.shippingCarrier = '' // show unselected carrier (directions) and empty tracking id (clean state)
      order.isOpen = true // update order object
      data.orders = data.orders // update orders array

      setTimeout(() => { // now that the element is in the DOM
        order.trOrderDetails?.classList.add('visible') // slide order details open
      }, 90)
    }
  }


  function setEnableShippingInputs (order: Order) {
    order.enableShippingInputs = false

    for (const orderItem of order.orderItems) {
      if (orderItem.status === enumOrderItemStatus.SHIPPING_TO_CUSTOMER) { // IF any order item has a status set to shipping => enable shipping inputs
        order.enableShippingInputs = true
        break
      }
    }

    if (!order.enableShippingInputs) order.shippingTrackingId = order.shippingCarrier = '' // IF no order item has a status set to shipping => clear shipping inputs
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

            <Button onClick={ searchOrders } css="brand" type="button" text="Search" isLoading={ isLoading.search } />
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
                      <button on:click={ (e) => toggleOrderDetails(e, order) } class="brand toggle { order.isOpen ? 'is-open': '' }">{ @html SVG_CHEVRON_RIGHT }</button>
                    </div>
                  </td>
                  <td>{ order.id }</td>
                  <td>{ order.email }</td>
                  <td>{ (new Date(order.createdAt)).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Los_Angeles' }) }</td>
                  <td class="right">${ (new Price(order.totalPrice)).str }</td>
                </tr>
                { #if order.isOpen }
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
                                  { #if orderItem.size || (orderItem.shippingCarrier && orderItem.shippingTrackingId) }
                                    <div class="size">
                                      { #if orderItem.size }
                                        <span class="fln__pr-text">Size: { orderItem.size }</span>
                                      { /if }
                                      { #if orderItem.shippingCarrier && orderItem.shippingTrackingId }
                                        { #if orderItem.size }
                                          <span class="fln__pr-text">⋅</span>
                                        { /if }
                                        <span class="fln__pr-text">Carrier: { orderItem.shippingCarrier }</span>
                                        <span class="fln__pr-text">⋅</span>
                                        { #if orderItem.shippingCarrier === enumShippingCarrier.FED_EX }
                                          <span>Tracking ID: <a target="_blank" href="https://www.fedex.com/fedextrack/?trknbr={ orderItem.shippingTrackingId }">{ orderItem.shippingTrackingId }</a></span>
                                        { :else if orderItem.shippingCarrier === enumShippingCarrier.USPS }
                                          <span>Tracking ID: <a target="_blank" href="https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels={ orderItem.shippingTrackingId }">{ orderItem.shippingTrackingId }</a></span>
                                        { /if }
                                      { /if }
                                    </div>
                                  { /if }
                                  <div class="product-name">{ orderItem.product?.name }</div>
                                  <div class="selects">
                                    <select bind:value={ orderItem.status } on:change={ () => setEnableShippingInputs(order) } class="brand status">
                                      <option value="" disabled>Set Order Items Status</option>
                                      { #each orderItemStatuses as orderItemStatus (orderItemStatus) }
                                        <option value={ orderItemStatus }>{ orderItemStatus }</option>
                                      { /each }
                                    </select>

                                    <select bind:value={ orderItem.quantity } disabled name="quantity" class="brand quantity">
                                      <option value="" disabled>Quantity</option>
                                      { #each { length: 28 } as _, index }
                                        <option value={ index }>{ index }</option>
                                      { /each }
                                    </select>
                                  </div>
                                </div>
                              </div>
                            { /each }

                            <div class="save">
                              <input bind:value={ order.shippingTrackingId } disabled={ order.enableShippingInputs !== true } type="text" class="brand tracking-number" placeholder="Shipping Tracking ID">
                              <select bind:value={ order.shippingCarrier } disabled={ order.enableShippingInputs !== true } class="brand shipping-carrier">
                                <option disabled value="">Shipping Carrier</option>
                                { #each shippingCarriers as shippingCarrier (shippingCarrier) }
                                  <option value={ shippingCarrier }>{ shippingCarrier }</option>
                                { /each }
                              </select>
                              <Button onClick={ () => updateOrderItems(order, index) } isLoading={ isLoading.updateOrderItems } text="Save" type="button" css="brand" />
                            </div>
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
                padding: 0.45rem 0.45rem 2.7rem 0.45rem !important;
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
                    max-width: 72rem;
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
                        width: 12.3rem;
                        min-width: 12.3rem;
                        margin-right: 0.9rem;

                        img {
                          width: 100%;
                        }
                      }

                      .info {
                        margin-right: 2.1rem;

                        .size {
                          margin-bottom: 0.45rem;
                        }

                        .product-name {
                          width: 100%;
                          font-weight: 500;
                          margin-bottom: 0.9rem;
                        }

                        .selects {
                          display: flex;
                          justify-content: start;
                          align-items: center;

                          select {
                            height: 3.6rem;
                            &.status {
                              width: 28.2rem;
                              margin-right: 1.8rem;
                            }
                            &.quantity {
                              width: 6rem;
                            }
                          }
                        }
                      }
                    }

                    .save {
                      display: flex;
                      justify-content: start;
                      align-items: end;
                      margin-top: 2.7rem;

                      input,
                      select {
                        margin-right: 0.9rem;
                      }

                      .tracking-number,
                      .shipping-carrier {
                        width: 27rem;
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
