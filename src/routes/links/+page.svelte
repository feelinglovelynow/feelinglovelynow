<script lang="ts">
  import Head from '$lib/components/Head.svelte'
  import Title from '$lib/components/Title.svelte'
  import GuitarPic from '$lib/components/GuitarPic.svelte'
  import { CF_OG_LINKS } from '$lib/util/cloudflareImages'
  import SocialSupport from '$lib/components/SocialSupport.svelte'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'

  // https://savvytime.com/converter/utc-to-ca-los-angelesuy
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
  // Date.UTC(year, monthIndex, day, hour, minute)
  const dates = { 
    next: Date.UTC(2023, 7, 14, 23, 44),
    nextNext: Date.UTC(2023, 7, 16, 23, 44),
    nextNextNext: Date.UTC(2023, 7, 21, 23, 44),
  }

  const remaining = {
    next: getRemaining(dates.next),
    nextNext: getRemaining(dates.nextNext),
    nextNextNext: getRemaining(dates.nextNextNext),
  }

  const pretty = {
    next: getPrettyDate(dates.next),
    nextNext: getPrettyDate(dates.nextNext),
    nextNextNext: getPrettyDate(dates.nextNextNext),
  }


  function getRemaining (upcomingDate: number) {
    let remaining = ''
    const MINUTE_IN_MS = 60000
    const CLASS_LENGTH_IN_MINUTES = 75
    const difference = upcomingDate - +new Date()

    if (difference > 0) {
      const parts = new Map([ // https://www.digitalocean.com/community/tutorials/js-building-countdown-timer
        ['days',    Math.floor(difference / (1000 * 60 * 60 * 24))],
        ['hours',   Math.floor((difference / (1000 * 60 * 60)) % 24)],
        ['minutes', Math.floor((difference / 1000 / 60) % 60)],
        ['seconds', Math.floor((difference / 1000) % 60)],
      ])

      for (const [ key, value ] of parts) {
        if (value) {
          if (value === 1) remaining +=  `${ value } ${ key.substring(0, key.length - 1) } `
          else remaining +=  `${ value } ${ key } `
        }
      }
    }
    else if ((difference / MINUTE_IN_MS) > -CLASS_LENGTH_IN_MINUTES) remaining = 'Class happening now!'
    else remaining = 'Class just ended!'

    return remaining
  }

  function getPrettyDate (upcomingDate: number) {
    return new Date(upcomingDate).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Los_Angeles' })
  }

  setInterval(() => {
    remaining.next = getRemaining(dates.next)
    remaining.nextNext = getRemaining(dates.nextNext)
    remaining.nextNextNext = getRemaining(dates.nextNextNext)

    pretty.next = getPrettyDate(dates.next)
    pretty.nextNext = getPrettyDate(dates.nextNext)
    pretty.nextNextNext = getPrettyDate(dates.nextNextNext)
  }, 1000)
</script>


<Head title="Links" ogImageId={ CF_OG_LINKS } description="Chris Carrington offers free, Gentle Yoga & Sound Healing classes, in Mount Shasta & online. This page provides links & helpful information to stay connected with Chris & his class!" />

<GuitarPic />
<Title text="Aloha!" size="two" />
<SocialSupport />

<section class="title chris">
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

<a href="https://teams.live.com/meet/9355564920768" class="link" target="_blank">
  <section class="title">🥰 Join Class Live</section>
</a>

<a href="https://soulconnectionscommunitycenter.com/" class="link" target="_blank">
  <section class="title">
    <div>📍 Soul Connections Community Center</div>
    <div>329 N Mt Shasta Blvd, Mount Shasta</div>
    <div>(530) 859-8831</div>
  </section>
</a>

<a href="/contact" class="link">
  <section class="title">👋 Get in touch</section>
</a>

<section class="title remaining">
  <div class="strong">Next Class</div>
  <div>{ pretty.next }</div>
  <div>{ remaining.next }</div>
</section>

<section class="title remaining">
  <div class="strong">Next Next Class</div>
  <div>{ pretty.nextNext }</div>
  <div>{ remaining.nextNext }</div>
</section>

<section class="title remaining">
  <div class="strong">Next Next Next Class</div>
  <div>{ pretty.nextNextNext }</div>
  <div>{ remaining.nextNextNext }</div>
</section>


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
  }</style>
