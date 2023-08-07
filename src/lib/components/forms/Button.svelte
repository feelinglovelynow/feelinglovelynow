<script lang="ts">
  import SVG_LOADING from '$lib/svg/SVG_LOADING.svg'

  export let text: string
  export let css: string = ''
  export let onClick = function () {}
  export let disabled: boolean = false
  export let isLoading: boolean = false
  export let color: string = 'brand'
  export let type: 'submit' | 'button' | 'reset' = 'submit'
</script>


<button { type } class="full-width { color } { isLoading ? 'loading': '' } { css }" disabled={ isLoading || disabled } on:click={ onClick }>
  { @html SVG_LOADING }
  <span class="text">{ text }</span>
</button>
