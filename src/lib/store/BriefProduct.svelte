<script lang="ts">
  import type { Product } from '$lib'
  import { cart, set } from '$lib/store/cart'
  import { showToast } from '@feelinglovelynow/toast'

  export let product: Product

  let size = ''
  let quantity = ''
  const sizes = [
    { value: '', name: 'Size' },
    { value: 'S', name: 'Small' },
    { value: 'M', name: 'Medium' },
    { value: 'L', name: 'Large' },
    { value: 'XL', name: 'X-Large' },
  ]


  function addToCart () {
    const errors = []

    if (!size && !quantity) errors.push('Please select a quantity and size')
    else if (!size) errors.push('Please select a size')
    else if (!quantity) errors.push('Please select a quantity')

    if (errors.length) showToast('info', errors)
    else {
      const cartItem = {
        productId: product.id,
        size,
        quantity: Number(quantity)
      }

      $cart.push(cartItem)
      set($cart)
      showToast('success', `Shopping cart updated! <span class="link view-cart-link">View cart!</span>`)

      setTimeout(() => { // allow some time for the cart and toast to appear
        const links = document.querySelectorAll('.view-cart-link') as NodeListOf<Element> // link in the toast (there might be multiple toast showing)
        const button = document.querySelector('#shopping-cart-button button') as HTMLButtonElement | undefined // button to launch the shopping cart

        if (links.length && button) {
          for (const link of links) {
            link.addEventListener('click', () => button.click()) // on link click => the shopping cart button
          }
        }
      }, 300)
    }
  }
</script>

<div class="wrapper">
  <section>
    <div class="brief">

      <div class="image">
        { #if product.image?.src }
          <img src={ product.image.src } alt={ product.name } loading="lazy"/>
        { /if }
      </div>

      <div class="footer">
        <div class="prices">
          <div class="sale">
            <div class="label">Sale</div>
            <div class="amount">${ product.price }</div>
          </div>
          <div class="regular">
            <div class="label">Regular</div>
            <div class="amount">${ product.highPrice }</div>  
          </div>
        </div>
        <div class="row">
          <div class="name">
            <div>100% Organic Cotton</div>
            <div>{ product.name }</div>
          </div>

          <div class="form">
            <select aria-label="Quantity" name="quantity" value="" class="brand quantity" on:change={ x => { quantity = x.currentTarget.value } }>
              <option value="" disabled>Quantity</option>
              { #each { length: 27 } as _, index }
                <option value={ index + 1 }>{ index + 1 }</option>
              { /each }
            </select>
  
            <select aria-label="Size" name="size" value="" class="brand size" on:change={ x => { size = x.currentTarget.value } }>
              { #each sizes as { value, name } }
                <option { value } disabled={ value === '' }>{ name }</option>
              { /each }
            </select>
            <button class="brand" on:click={ addToCart }>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>



<style lang="scss">
  @import '$lib/scss/variables.scss';

  .wrapper {
    width: 100vw;
    padding: 1.8rem;
    margin: 0 auto;

    @media only screen and (min-width: 54rem) { // medium screen
      width: 50%;
    }

    section {
      padding: 0;
      margin: 0;
      background-color: transparent;

      @media only screen and (min-width: 561px) { // medium screen
        margin: 0 1.8rem;
      }

      .brief {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0;
      }

      .image {
        aspect-ratio: 1/1;
        width: 100%;
        max-width: calc(100vw - 3.6rem);
        display: block;
        text-align: center;
        padding: 1.8rem;
        background-color: transparent;

        img {
          width: 100%;
          transition: all 0.9s;
        }
      }

      .footer {
        font-weight: 500;
        border-radius: 1.8rem;
        padding: 1.2rem 1.8rem;
        background-color: var(--opacity-bg);

        .prices {
          display: flex;
          justify-content: center;

          .sale {
            color: #bb0c0c;
          }

          .regular {
            opacity: 0.3;
            margin-left: 1.8rem;
            color: rgb(102, 102, 102);
          }
        }

        .label,
        .amount {
          text-align: center;
          
        }

        .label {
          font-size: 2.1rem;
          margin-bottom: -0.9rem;
        }

        .amount {
          font-size: 5.4rem;
        }

        .row {
          $swap-view-width: 90rem;

          margin-top: 0.9rem;
          display: flex;
          flex-direction: column;

          @media only screen and (min-width: $swap-view-width) { // big screen
            align-items: center;
            flex-direction: row;
          }

          .name {
            color: var(--black-text-color);
            margin: 0 0 1.5rem 0;
            text-align: center;
            font-size: 1.8rem;

            @media only screen and (min-width: $swap-view-width) { // big screen
              text-align: left;
              margin: 0 2.1rem 0 0;
            }
          }

          .form {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            @media only screen and (min-width: $swap-view-width) { // big screen
              justify-content: end;
            }

            select {
              margin-right: 1.5rem;
              &.quantity {
                width: 10.2rem;
              }
              &.size {
                width: 9rem;
              }
            }

            button {
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
</style>
