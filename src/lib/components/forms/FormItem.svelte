<script lang="ts">
  import { onMount } from 'svelte'

  export let errors: any
  export let name: string
  export let css: string = ''
  export let label: string = ''
  export let maxWidth: string = ''
  export let type: string = 'text'
  export let autocomplete: string = ''
  export let value: string | null = ''
  export let focusOnInit: boolean = false
  export let checkboxValue: boolean | null = false

  let itemErrors: any
  let input: HTMLInputElement

  $: if (errors) itemErrors = errors?.[ name ]?._errors

  function clearErrors() {
    if (itemErrors?.length) itemErrors.length = 0
  }

  const id: string = crypto.randomUUID()

  if (focusOnInit) {
    onMount(() => {
      input.focus()
    })
  }
</script>

<div class="form-item form-item--{ type } { css }">
  { #if type === 'textarea' }
    <label for={ id }>{ label }</label>
    <textarea class={ itemErrors?.length ? 'erro brand': 'brand' } { value } on:input={ () => { clearErrors() } } { name } { id } />
  { :else if type === 'checkbox' }
    <label style="max-width:{ maxWidth };" for={ id } class="checkbox { itemErrors?.length ? 'error': '' }" on:input={ () => { clearErrors() } }>
      <div class="checkbox-input-wrapper">
        <input { id } { name } checked={ checkboxValue } type="checkbox" />
      </div>
      { @html label }
    </label>
  { :else }
    <label for={ id }>{ label }</label>
    <input bind:this={ input } { value } { autocomplete } class={ itemErrors?.length ? 'error brand': 'brand' } on:input={ () => { clearErrors() } } { name } { id } { type } />
  { /if }
  { #if itemErrors?.length }
    { #each itemErrors as error }
      <div class="error">{ error }</div>
    { /each }
  { /if }
</div>
