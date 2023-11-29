<script lang="ts">
  import Button from '$lib/form/Button.svelte'
  import showToast from '@feelinglovelynow/toast'
  import FormItem from '$lib/form/FormItem.svelte'
  import type { FormInputs, FormOnSuccess } from '$lib'
  import { getFormEntries } from '@feelinglovelynow/get-form-entries'
  import { PUBLIC_ENVIRONMENT, PUBLIC_CLOUDFLARE_TURNSTILE_KEY } from '$env/static/public'
  import { Turnstile, PUBLIC_KEY_ALWAYS_PASSES } from '@feelinglovelynow/svelte-turnstile'

  export let schema: any
  export let css: string = ''
  export let endpoint: string
  export let inputs: FormInputs
  export let buttonText: string = 'Send'
  export let resetOnSuccess: boolean = false
  export let onSuccess: FormOnSuccess = () => {}

  let errors: any
  let isLoading = false

  async function handleSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
    const form = event.currentTarget
		const formData = new FormData(form)
    const fields = getFormEntries(formData)
    const validationResponse = schema.safeParse(fields)

    if (!validationResponse.success) bindErrors(validationResponse.error.format())
    else {
      isLoading = true

      const rFetch = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(fields),
        headers: { 'Content-Type': 'application/json' }
      })

      const r = await rFetch.json()

      if (r._errors) bindErrors(r)
      else {
        if (resetOnSuccess) form.reset()
        onSuccess({ fields, r })
      }

      isLoading = false
    }
  }


  function bindErrors (r: any) {
    errors = r
    if (r._errors.length) showToast('info', r._errors)
  }
</script>


<section class="{ css }">
  <form method="POST" on:submit|preventDefault={ handleSubmit }>
    { #if inputs?.length }
      { #each inputs as input }
        { #if Array.isArray(input) }
          <div class="two-form-items">
            { #each input as subInput }
              <FormItem name={ subInput.name } label={ subInput.label } value={ subInput.value } checkboxValue={ subInput.checkboxValue } type={ subInput.type || 'text' } { errors } />
            { /each }
          </div>
        { :else }
          <FormItem name={ input.name } label={ input.label } value={ input.value } checkboxValue={ input.checkboxValue } type={ input.type || 'text' } { errors } css={ input.hidden ? 'hidden' : '' } maxWidth={ input.maxWidth } focusOnInit={ input.focusOnInit } autocomplete={ input.autocomplete } />
        { /if}
      {/each }
    { /if }
    <Turnstile sitekey={ PUBLIC_ENVIRONMENT === 'local' ? PUBLIC_KEY_ALWAYS_PASSES : PUBLIC_CLOUDFLARE_TURNSTILE_KEY } />
    <Button text={ buttonText } { isLoading } />
  </form>
</section>


<style lang="scss">
  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    :global(iframe) {
      display: none;
    }

    :global(button) {
      margin-top: 0.6rem;
    }
  }
</style>
