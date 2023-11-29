<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import type { PageData } from './$types'
  import Head from '$lib/global/Head.svelte'
  import Title from '$lib/global/Title.svelte'
  import Button from '$lib/form/Button.svelte'
  import { routeCatch } from '$lib/global/catch'
  import Product from '$lib/source/Product.svelte'
  import Science from '$lib/source/Science.svelte'
  import Culture from '$lib/source/Culture.svelte'
  import { goto, onNavigate } from '$app/navigation'
  import { enumSourceType } from '$lib/global/enums'
  import TypeChips from '$lib/chips/TypeChips.svelte'
  import AuthorChips from '$lib/chips/AuthorChips.svelte'
  import CategoryChips from '$lib/chips/CategoryChips.svelte'
  import type { Source, Author, Category, Quote } from '$lib'
  import IMG_OG_LIBRARY from '$lib/img/og/IMG_OG_LIBRARY.webp'
  import { loopBackwards}  from '@feelinglovelynow/loop-backwards'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let data: PageData
  routeCatch(data)

  let isPageLoading = true
  let authors: Author[] = []
  let preParseSourceCount = 0
  let postParseSourceCount = 0
  let categories: Category[] = []
  let visibleSources: Source[] = []
  let isShowMoreButtonVisible: boolean
  let isShowMoreButtonLoading: boolean
  let showMoreSourcesButton: HTMLDivElement
  let title: string = 'Welcome to our Library!'
  let currentCount: number | undefined = undefined
  let currentAuthor: Author | undefined = undefined
  let currentType: enumSourceType | undefined = undefined
  let currentCategory: Category | undefined = undefined

  const titleParts: string[] = []

  $: if (showMoreSourcesButton) { // add observer to infinite scroll button
    (new IntersectionObserver(showMoreSources, { rootMargin: '270px' })).observe(showMoreSourcesButton)
  }

  function setIsShowMoreButtonVisible () {
    postParseSourceCount = visibleSources?.length
    isShowMoreButtonVisible = preParseSourceCount !== postParseSourceCount
    preParseSourceCount = postParseSourceCount
  }

  onMount(() => {
    parseSources(null)
  })

  onNavigate(navigation => {
    if (navigation.to?.route.id === '/library') parseSources(null)
  })

  function reset () {
    currentType = undefined
    currentCount = undefined
    currentAuthor = undefined
    currentCategory = undefined
    title = 'Welcome to our Library!'
    visibleSources = JSON.parse(JSON.stringify(data.sources)) as Source[]
  }

  function parseSources (visibleCount: null | number) {
    reset()
    const mapAuthors: Map<string, Author> = new Map() // use map so duplicates are removed
    const mapCategories: Map<string, Category> = new Map() // use map so duplicates are removed
    const searchParams = new URLSearchParams(document.location.search) // $page is not reliable for the current $page searchParams sometimes
    const url = {
      type: getUrlParamType(searchParams),
      author: searchParams.get('author'),
      category: searchParams.get('category'),
      count: visibleCount || Number(searchParams.get('count')) || 6,
    }

    loopBackwards(visibleSources, (source, spliceSource) => {
      let sourceIsValid = true
      let urlAuthorWroteSource = false

      if (source?.authors) {
        for (const author of source.authors) {
          mapAuthors.set(author.slug, author) // place each author in map

          if (url.author && author.slug === url.author) { // if an author param is requested in the URL AND the author in the loop matches the urlAuthorSlug
            currentAuthor = author
            urlAuthorWroteSource = true
          }
        }
      }

      if (source.type === 'science') {
        if (source.quotes) {
          let sourceCategories: Map<string, Category> = new Map() // use map so duplicates are removed

          loopBackwards(source.quotes, (quote, spliceQuote) => {          
            let quoteHasUrlCategory = false

            if (quote.categories) {
              for (const category of quote.categories) {
                mapCategories.set(category.slug, category) // place each category in map of all categories

                if (!url.category) addCategoriesToSourceCategories(quote, sourceCategories) // if no category is requested in the url => place categories from quote into source categories
                else if (category.slug === url.category) { // if a category param is requested in the URL AND the category in the loop matches the urlCategorySlug
                  currentCategory = category // save this full variable representing the url slug as an object filled w/ properties
                  quoteHasUrlCategory = true // tip flag indicating quote from url found
                  addCategoriesToSourceCategories(quote, sourceCategories) // place categories from quote into source categories
                }
              }
            }

            if (url.category && !quoteHasUrlCategory) spliceQuote() // if a category param is requested in the URL AND this quote does not in the requested category => remove quote from source
            else source.categories = [...sourceCategories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)) // source is valid => set source categories AND sort them by name
          })
        }
      } else { // culture || product
        let sourceHasUrlCategory = false

        if (source.categories) {
          for (const category of source.categories) {
            mapCategories.set(category.slug, category) // place each category in map of all categories

            if (category.slug === url.category) { // category in source matches category in URL
              sourceHasUrlCategory = true // tip flag
              currentCategory = category // save this full variable representing the url slug as an object filled w/ properties
            }
          }

          if (url.category && !sourceHasUrlCategory) sourceIsValid = false // if a category param is requested in the URL AND category in url is not in this source => tip remove source flag
          else source.categories.sort((a: Category, b: Category) => Number(a.name > b.name) - Number(a.name < b.name)) // sort categories by name
        } else if (url.category) { // if a category param is requested in the URL AND source has no categories => tip remove source flag
          sourceIsValid = false
        }
      }

      if (!sourceIsValid) spliceSource() // if splice source requested => remove source
      else if (url.type && url.type !== source.type) spliceSource() // if source type is requested in the URL AND this source is not in that type => remove source
      else if (url.author && !urlAuthorWroteSource) spliceSource() // if an author param is requested in the URL AND this source was not written by this author => remove source
      else if (source.type === 'science' && !source.quotes?.length) spliceSource() // if science source has no quotes => remove source
      else if (source.type === 'science') source.quotes?.sort((a: Quote, b: Quote) => a.displayOrder - b.displayOrder) // sorce is valid AND it is a science source => sort quotes by displayOrder      
    })

    currentType = url.type
    currentCount = url.count
    visibleSources = visibleSources.slice(0, currentCount)
    authors = [...mapAuthors.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)) // sort authors by name
    categories = [...mapCategories.values()].sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name)) // sort categories by name

    bindTitle()
    setIsShowMoreButtonVisible()
    isPageLoading = false
  }

  function bindTitle () { // bind title
    titleParts.length = 0
    if (currentType) titleParts.push(currentType.charAt(0).toUpperCase() + currentType.slice(1))
    if (currentCategory) titleParts.push(currentCategory.name)
    if (currentAuthor) titleParts.push(currentAuthor.name)
    if (titleParts.length) title = titleParts.join(' ⋅ ')
  }

  function getUrlParamType (searchParams: URLSearchParams): enumSourceType | undefined {
    const type = searchParams.get('type')
    return (type === enumSourceType.science || type === enumSourceType.product || type === enumSourceType.culture) ? type : undefined
  }

  function addCategoriesToSourceCategories (quote: Quote, sourceCategories: Map<string, Category>) {
    if (quote.categories) {
      for (const category of quote.categories) {
        sourceCategories.set(category.slug, category)
      }
    }
  }

  function showMoreSources (entries: IntersectionObserverEntry[]) { // update the url w/ 6 more sources => onNavigate will trigger
    if (entries[0].isIntersecting) {
      if (visibleSources.length % 6 !== 0) isShowMoreButtonVisible = false
      else {
        const visibleCount = visibleSources.length + 6
        const url = new URL($page.url)
        url.searchParams.set('count', String(visibleCount))
        goto(url, { noScroll: true, keepFocus: true, invalidateAll: false, replaceState: true })
      }
    }
  }
</script>


<Head { title } ogImageSrc={ IMG_OG_LIBRARY } description="Welcome to our library!" />


{ #if isPageLoading }
  <main>
    <div class="fln__circle-load"></div>
  </main>
{ :else }
  <main>
    <Title text="Library" size="one" />
    <Title text={ title } size="two" />


    <div class="content">
      <div class="flow-layout__left">
        <TypeChips type={ currentType } />
        { #if categories }
          <CategoryChips type={ currentType } category={ currentCategory } { categories } location="nav" />
        { /if }
        { #if authors }
          <AuthorChips author={ currentAuthor } { authors } location="nav" />
        { /if }
      </div>

      { #if visibleSources?.length }
        { #each visibleSources as source (source.uid) }
          { #if source.type === 'science' }
            <Science { source } type={ currentType } category={ currentCategory } author={ currentAuthor } css="flow-layout__right-item" location="library" />
          { :else if source.type === 'culture' }
            <Culture { source } type={ currentType } category={ currentCategory } author={ currentAuthor } css="flow-layout__right-item" location="library" />
          { :else if source.type === 'product' }
            <Product { source } type={ currentType } category={ currentCategory } author={ currentAuthor } css="flow-layout__right-item" location="library" />
          { /if }
        { /each }
      { :else }
        <Title css="flow-layout__right-item">
          <span>No library items found. Would you love to <LoadingAnchor href="/library" label="view all" widthRem={ 2.7 } />?!</span>
        </Title>
      { /if }

      { #if isShowMoreButtonVisible }
        <div bind:this={ showMoreSourcesButton } class="more-wrapper flow-layout__right-item">
          <Button text="Show more sources" isLoading={ isShowMoreButtonLoading } />
        </div>
      { /if }
      <div class="fln__clear"></div>
    </div>
  </main>
{ /if }


<style lang="scss">
  .content {

    :global(.source) {
      margin-bottom: 1.8rem;
    }

    .more-wrapper {
      display: flex;
      justify-content: center;
    }
  }
</style>
