<script lang="ts">
  import '$lib/scss/braintree.scss'
  import dropin from 'braintree-web-drop-in'
  import showToast from '@sensethenlove/toast'
  import { PUBLIC_BRAINTREE_TOKENIZATION_KEY } from '$env/static/public'

  let isFormVisible: boolean
  let dropinContainer: HTMLDivElement
  let dropinSubmitButton: HTMLButtonElement

  $: if (dropinContainer) {
    const style = getComputedStyle(document.body)

    dropin.create({
      container: dropinContainer,
      authorization: PUBLIC_BRAINTREE_TOKENIZATION_KEY,
      card: {
        overrides: {
          styles: {
            input: {
              padding: '0 8px',
              color: style.getPropertyValue('--text-color'),
            },
            ':focus': {
              color: style.getPropertyValue('--text-color'),
            },
            '::placeholder': {
              color: style.getPropertyValue('--text-color'),
            },
            ':-webkit-autofill': {
              color: style.getPropertyValue('--black-text-color'),
            },
            '.invalid': {
              color: style.getPropertyValue('--red-text-color'),
              'box-shadow': style.getPropertyValue('--focus-error-box-shadow')
            },
          }
        }
      }
    }, (error, dropinInstance) => {
      if (error) showToast({ type: 'info', items: [ 'There was an error creating our payment submission' ] })
      else if (dropinInstance) {
        isFormVisible = true

        dropinSubmitButton.addEventListener('click', () => {
          dropinInstance.requestPaymentMethod((err, payload) => {
            if (err) showToast({ type: 'info', items: [ 'Error submitting payment' ] })
            else console.log(payload)
          })
        })
      }
    })
  }
</script>


<div class="braintree { isFormVisible ? 'visible' : '' }">
  <div bind:this={ dropinContainer }></div>
  <div class="btn-wrapper">
    <button bind:this={ dropinSubmitButton } class="brand full-width">Purchase</button>
  </div>
</div>


<style lang="scss">
  .braintree {
    opacity: 0;
    transform: translateY(-1.8rem);
    transition: all 0.3s;
    border-radius: 0.6rem;
    background-color: var(--opacity-bg);

    .btn-wrapper {
      margin-top: -2rem;
      padding: 0 1rem 1rem 1rem;
    }
  }

  :global(.braintree.visible) {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
</style>