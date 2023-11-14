<script lang="ts">
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import Head from '$lib/global/Head.svelte'
  import Title from '$lib/global/Title.svelte'
  import EmailUs from '$lib/form/EmailUs.svelte'
  import AboutUs from '$lib/global/AboutUs.svelte'
  import GuitarPic from '$lib/global/GuitarPic.svelte'
  import IMG_OG_LINKS from '$lib/img/og/IMG_OG_LINKS.webp'
  import toastRouteError from '$lib/catch/toastRouteError'
  import SimpleLoader from '$lib/global/SimpleLoader.svelte'
  import SocialSupport from '$lib/global/SocialSupport.svelte'
  import FeaturedProducts from '$lib/store/FeaturedProducts.svelte'
  import sortFeaturedProducts from '$lib/store/sortFeaturedProducts'

  export let data: PageData
  toastRouteError(data)

  $: products = sortFeaturedProducts(data.products)

  type YogaClass = {
    ms?: number,
    label: string,
    pretty?: string,
    remaining?: string
  }

  let yogaClasses: YogaClass[] = [
    { label: 'Next Class' },
    { label: 'Next Next Class' },
    { label: 'Next Next Next Class' },
  ]

  const calendar = [ // Date.UTC(year, monthIndex, day, hour, minute)
    // November
    Date.UTC(2023, 10, 15, 24, 44),
    Date.UTC(2023, 10, 20, 24, 44),
    Date.UTC(2023, 10, 22, 24, 44),
    Date.UTC(2023, 10, 27, 24, 44),
    Date.UTC(2023, 10, 29, 24, 44),

    // December
    Date.UTC(2023, 11, 4, 24, 44),
    Date.UTC(2023, 11, 6, 24, 44),
    Date.UTC(2023, 11, 11, 24, 44),
    Date.UTC(2023, 11, 13, 24, 44),
    Date.UTC(2023, 11, 18, 24, 44),
    Date.UTC(2023, 11, 20, 24, 44),
    Date.UTC(2023, 11, 25, 24, 44),
    Date.UTC(2023, 11, 27, 24, 44),

    // January
    Date.UTC(2023, 0, 1, 24, 44),
    Date.UTC(2023, 0, 3, 24, 44),
    Date.UTC(2023, 0, 8, 24, 44),
    Date.UTC(2023, 0, 10, 24, 44),
    Date.UTC(2023, 0, 15, 24, 44),
    Date.UTC(2023, 0, 17, 24, 44),
    Date.UTC(2023, 0, 22, 24, 44),
    Date.UTC(2023, 0, 24, 24, 44),
    Date.UTC(2023, 0, 29, 24, 44),
    Date.UTC(2023, 0, 31, 24, 44),
  ]


  onMount(() => { // so we use the users timezone
    initYogaClasses()
    setInterval(updateRemaining, 1000)


    function getPrettyDate (msDate: number) {
      return new Date(msDate).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
    }


    function initYogaClasses () {
      let foundCount = 0

      for (const date of calendar) {
        const difference = date - +new Date() // greater then 0 if class is in the future

        if (foundCount === 3) break
        else if (difference > 0) {
          yogaClasses[foundCount].ms = date
          yogaClasses[foundCount].pretty = getPrettyDate(date)
          yogaClasses[foundCount].remaining = getRemaining(date)
          foundCount++
        }
      }
    }


    function updateRemaining () {
      for (const yogaClass of yogaClasses) {
        if (yogaClass.ms) yogaClass.remaining = getRemaining(yogaClass.ms)
      }

      yogaClasses = yogaClasses
    }


    function getRemaining (upcomingDate: number) {
      let remaining = ''
      const difference = upcomingDate - +new Date()

      const parts = new Map([ // https://www.digitalocean.com/community/tutorials/js-building-countdown-timer
        ['day',    Math.floor(difference / (1000 * 60 * 60 * 24))],
        ['hour',   Math.floor((difference / (1000 * 60 * 60)) % 24)],
        ['minute', Math.floor((difference / 1000 / 60) % 60)],
        ['second', Math.floor((difference / 1000) % 60)],
      ])

      for (const [ key, value ] of parts) {
        if (value) {
          if (value === 1) remaining +=  `1 ${ key } ` // singular
          else remaining +=  `${ value } ${ key }s ` // plural
        }
      }

      return remaining.slice(0, -1) // remove last space
    }
  })
</script>


<Head title="Links" ogImageSrc={ IMG_OG_LINKS } description="Chris Carrington offers free, Gentle Yoga & Sound Healing classes, in Mount Shasta & online. This page provides links & helpful information to stay connected with Chris & his class!" />

<main>
  <GuitarPic />
  <Title text="Aloha!" size="two" />
  <SocialSupport />
  <AboutUs />

  <a href="https://teams.live.com/meet/9355564920768" class="link glow" target="_blank">
    <button class="brand large" type="button">💞 Join Class Live</button>
  </a>

  <a href="https://soulconnectionscommunitycenter.com/" class="link glow" target="_blank">
    <button class="brand large" type="button">📍 Soul Connections</button>
  </a>

  <a href="https://paypal.me/feelinglovelynow/9" class="link glow" target="_blank">
    <button class="brand large" type="button">🥰 Buy me an açaí ($9 tip)!</button>
  </a>

  { #each yogaClasses as yogaClass (yogaClass.label) }
    <section class="title remaining glow">
      <div class="fln__strong">{ yogaClass.label }</div>
      <div>
        { #if yogaClass.pretty }
          { yogaClass.pretty }
        { /if }
      </div>

      <div>
        { #if yogaClass.remaining }
          { yogaClass.remaining }
        { :else }
          <SimpleLoader />
        { /if }
      </div>
    </section>
  { /each }

  <EmailUs />
  <FeaturedProducts { products } productCategories={ data.productCategories }  />
</main>



<style lang="scss">
  .remaining {
    font-size: 1.8rem;

    div {
      margin-bottom: 0.6rem;
      &:last-child {
        margin-bottom: 0;
      }

      :global(.fln__simple-load) {
        display: flex;
        justify-content: center;
      }
    }

    :global(svg) {
      color: var(--gold-text-color);
      height: 7.68rem;
    }
  }

  .brand {
    margin-bottom: 1.8rem;
  }

  .link {
    font-size: 2.1rem;
  }
</style>
