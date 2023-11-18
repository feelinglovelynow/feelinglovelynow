<script lang="ts">
  import Form from '$lib/form/Form.svelte'
  import { schemaSearch } from '$lib/zod/search'
  import showToast from '@feelinglovelynow/toast'
  import Science from '$lib/source/Science.svelte'
  import Culture from '$lib/source/Culture.svelte'
  import Product from '$lib/source/Product.svelte'
  import SVG_SEARCH from '$lib/svg/nav/SVG_SEARCH.svg'
  import type { FormInputs, FormOnSuccess, SearchResponse } from '$lib'
  import { Modal, type ShowModal } from '@feelinglovelynow/svelte-modal'


  let showModal: ShowModal
  let response: SearchResponse | null = null
  const searchOptions = [ 'sourcesByTitle', 'sourcesByDescription', 'quotes' ]
  const inputs: FormInputs = [
    { name: 'query', focusOnInit: true, autocomplete: 'off' },
    { name: 'isSourcesByTitleChecked', label: 'Search library titles',  type: 'checkbox' },
    { name: 'isSourcesByDescriptionChecked', label: 'Search library descriptions',  type: 'checkbox' },
    { name: 'isQuotesChecked', label: 'Search scientific journal quotes', type: 'checkbox' },
  ]


  const onSuccess = (({ r }) => {
    let resultsFound = false

    for (const option of searchOptions) {
      if (r?.[ option ]?.length) {
        resultsFound = true
        break
      }
    }

    if (resultsFound) response = r
    else {
      response = null
      showToast('info', 'No search results found')
    }
  }) satisfies FormOnSuccess
</script>


<button class="search__button top brand nav__mini-button hide-on-modal-visible light-glow" on:click={ showModal } title="Click to search">
  { @html SVG_SEARCH }
</button>

<button class="search__button bottom brand nav__mini-button hide-on-modal-visible light-glow" on:click={ showModal } title="Click to search">
  { @html SVG_SEARCH }
</button>

<Modal header="Search" on:functions={ e => showModal = e.detail.showModal }>
  <Form { inputs } schema={ schemaSearch } { onSuccess } endpoint="/search" buttonText="Search" />

  <div class="response">
    { #if response?.sourcesByTitle?.length }
      <div class="papyrus three">Library title results:</div>
      { #each response.sourcesByTitle as source }
        { #if source.type === 'science' }
          <Science { source } location="search--source-titles" />
        { :else if source.type === 'culture' }
          <Culture { source } location="search--source-titles" />
        { :else if source.type === 'product' }
          <Product { source } location="search--source-titles" />
        { /if }
      { /each }
    { /if }

    { #if response?.sourcesByDescription?.length }
      <div class="papyrus three">Library description results:</div>
      { #each response.sourcesByDescription as source }
        { #if source.type === 'science' }
          <Science { source } location="search--source-titles" />
        { :else if source.type === 'culture' }
          <Culture { source } location="search--source-titles" />
        { :else if source.type === 'product' }
          <Product { source } location="search--source-titles" />
        { /if }
      { /each }
    { /if }

    { #if response?.quotes?.length }
      <div class="papyrus three">Science quote results:</div>
      { #each response.quotes as source }
        <Science { source } location="search--with-quote" />
      { /each }
    { /if }
  </div>
</Modal>


<style lang="scss">
  @import '$lib/scss/variables.scss';

  .papyrus {
    margin-top: 2.1rem;
  }

  .search {
    &__button {
      position: fixed;
      padding: 0.36rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: $zindex-nav;
      transition: opacity $theme-search-speed, transform $theme-search-speed;
      &.top {
        top: $theme-search-top;
        right: 27.6rem;
        opacity: 1;
        transform: translateY(0);

        @media only screen and (max-width: $move-nav-window-width) { // small screen
          opacity: 0;
          z-index: -1;
          transform: translateY(-0.9rem);
        }
      }
      &.bottom {
        bottom: $theme-search-bottom;
        left: 1.3rem;
        opacity: 1;
        transform: translateY(0);

        @media only screen and (min-width: $move-nav-window-width) { // big screen
          opacity: 0;
          z-index: -1;
          transform: translateY(-0.9rem);
        }
      }

      :global(svg) {
        width: 2.7rem;
        height: 2.7rem;
      }
    }
  }
</style>
