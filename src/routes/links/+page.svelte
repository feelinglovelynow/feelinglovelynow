<script lang="ts">
  import { onMount } from 'svelte'
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import GuitarPic from '$lib/components/GuitarPic.svelte'
  import IMG_OG_LINKS from '$lib/img/og/IMG_OG_LINKS.webp'
  import SocialSupport from '$lib/components/SocialSupport.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'

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


  const calendar = [ // Date.UTC(year, monthIndex, day, hour, minute) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC https://savvytime.com/converter/utc-to-ca-los-angelesuy
    // September
    Date.UTC(2023, 8, 11, 23, 44),
    Date.UTC(2023, 8, 13, 23, 44),
    Date.UTC(2023, 8, 18, 23, 44),
    Date.UTC(2023, 8, 20, 23, 44),
    Date.UTC(2023, 8, 25, 23, 44),
    Date.UTC(2023, 8, 27, 23, 44),

    // October
    Date.UTC(2023, 9, 2, 23, 44),
    Date.UTC(2023, 9, 4, 23, 44),
    Date.UTC(2023, 9, 9, 23, 44),
    Date.UTC(2023, 9, 11, 23, 44),
    Date.UTC(2023, 9, 16, 23, 44),
    Date.UTC(2023, 9, 18, 23, 44),
    Date.UTC(2023, 9, 23, 23, 44),
    Date.UTC(2023, 9, 25, 23, 44),
    Date.UTC(2023, 9, 30, 23, 44),
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
          if (value === 1) remaining +=  `1 ${ key }` // singular
          else remaining +=  `${ value } ${ key }s` // plural
        }
      }

      return remaining
    }
  })
</script>


<Head title="Links" url="links" ogImageSrc={ IMG_OG_LINKS } description="Chris Carrington offers free, Gentle Yoga & Sound Healing classes, in Mount Shasta & online. This page provides links & helpful information to stay connected with Chris & his class!" />

<GuitarPic />
<Title text="Aloha!" size="two" />
<SocialSupport />

<section class="title chris subtle-fade-in-from-above">
  <div class="papyrus one">Chris Carrington</div>
  <div class="description">
    <ul>
      <li>Chris ceated this site to be a <LoadingAnchor href="/library" label="library" /> of lovely <LoadingAnchor href="/library?type=science" label="scientific evidence" />, <LoadingAnchor href="/library?type=product" label="products" /> & <LoadingAnchor href="/library?type=culture" label="culture" /> for his Gentle Yoga & Sound Healing classes & all else who may love this information</li>
      <li>Chris offers free, Gentle Yoga & Sound Healing classes, in <a href="https://soulconnectionscommunitycenter.com/" target="_blank">Mount Shasta</a> & <a href="https://teams.live.com/meet/9355564920768" target="_blank">live online</a></li>
      <li>Class features stretches that are gentle, simple & effective. Each stretch is typically held for a couple minutes, to allow time for gravity to gently open us up</li>
      <li>The stretch or neutral position that feels good to you is far more important then what Chris suggests, so in class you may feel free to find, allow & savor any movements that feel good</li>
      <li>Class features many flows, which are opportunities to mix several stretches together @ any pace you love</li>
      <li>During the majority of stretches crystal singing bowls, guitar and/or gongs are gently played, live</li>
      <li>Class also features several opportunities to learn, practice & enjoy simple mindfulness meditation techniques that may be implemented outside of class, anytime</li>
      <li>Free mats available, donations welcome, all welcome!</li>
    </ul>
  </div>
</section>

<a href="https://teams.live.com/meet/9355564920768" class="link subtle-fade-in-from-above" target="_blank">
  <section class="title">🥰 Join Class Live</section>
</a>

<a href="https://soulconnectionscommunitycenter.com/" class="link subtle-fade-in-from-above" target="_blank">
  <section class="title">
    <div>📍 Soul Connections Community Center</div>
    <div>329 N Mt Shasta Blvd, Mount Shasta</div>
    <div>(530) 859-8831</div>
  </section>
</a>

<a href="/contact" class="link subtle-fade-in-from-above">
  <section class="title">👋 Get in touch</section>
</a>

{ #each yogaClasses as yogaClass (yogaClass.label) }
  <section class="title remaining subtle-fade-in-from-above">
    <div class="strong">{ yogaClass.label }</div>
      <div>
        { #if yogaClass.pretty }
          { yogaClass.pretty }
        { :else }
          Loading...
        { /if }
      </div>

      <div>
        { #if yogaClass.remaining }
          { yogaClass.remaining }
        { :else }
          Loading...
        { /if }
      </div>
  </section>
{ /each }


<style lang="scss">
  .remaining {
    font-size: 1.8rem;

    div {
      margin-bottom: 0.6rem;
      &:last-child {
        margin-bottom: 0;
      }
      &.strong {
        font-weight: 500;
      }
    }

    :global(svg) {
      color: var(--gold-text-color);
      height: 7.68rem;
    }
  }

  .link {
    font-size: 2.1rem;
  }

  .chris {

    .description {
      text-align: left;
      width: 81rem;
      max-width: 81vw;
    }
  }
</style>
