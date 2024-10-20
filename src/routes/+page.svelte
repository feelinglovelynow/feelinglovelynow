<script lang="ts">
  import type { Product } from '$lib'
  import { fade } from 'svelte/transition'
  import Hero from '$lib/global/Hero.svelte'
  import Head from '$lib/global/Head.svelte'
  import { routeCatch } from '$lib/global/catch'
  import Flower from '$lib/sacred/Flower.svelte'
  import SVG_VENMO from '$lib/svg/logo/SVG_VENMO.svg'
  import SVG_PAYPAL from '$lib/svg/logo/SVG_PAYPAL.svg'
  import IMG_OG_HOME from '$lib/img/og/IMG_OG_HOME.jpg'
  import SVG_YOUTUBE from '$lib/svg/logo/SVG_YOUTUBE.svg'
  import SVG_PATREON from '$lib/svg/logo/SVG_PATREON.svg'
  import SVG_FACEBOOK from '$lib/svg/logo/SVG_FACEBOOK.svg'
  import SVG_INSTAGRAM from '$lib/svg/logo/SVG_INSTAGRAM.svg'
  import FeaturedProducts from '$lib/store/FeaturedProducts.svelte'


  export let data: {
    locals: App.Locals
    products: Product[]
  }

  routeCatch(data)

  $: products = sortFeaturedProducts(data.products)

  function sortFeaturedProducts (products: Product[]): Product[] {
    const featuredProducts = []

    if (products?.length) {
      for (let i = 0; i < products.length; i++) {
        if (!products[i].deprecated && typeof products[i].displayOrder === 'number') featuredProducts.push(products[i])
      }

      featuredProducts.sort((a, b) => typeof a.displayOrder === 'number' && typeof b.displayOrder === 'number' ? a.displayOrder - b.displayOrder : 0) // sort by displayOrder
    }

    return featuredProducts
  }

  type PopoverVisibility = {
    youtube: boolean;
    instagram: boolean;
    patreon: boolean;
    facebook: boolean;
    venmo: boolean;
    paypal: boolean;
  }

  let popoverVisibility = {
    youtube: false,
    instagram: false,
    patreon: false,
    facebook: false,
    venmo: false,
    paypal: false,
  }

  function setPopoverVisiblity (name: keyof PopoverVisibility, flag: boolean) {
    popoverVisibility[name] = flag
  }
</script>


<Head title="Home" ogImageSrc={ IMG_OG_HOME } description="Welcome to Feeling Lovely Now!" />

<main class="initial">
  <Hero count={ 1 } />

  <div id="products">
  <FeaturedProducts { products }  />
  </div>

  <div id="about">
    <div class="sacred">
      <div class="papyrus one">About Sacred Geometry</div>
      <p>Einstein: <a href="https://mathshistory.st-andrews.ac.uk/Extras/Einstein_ether/" target="_blank">"Space without ether is unthinkable"</a>.</p>
      <p>Within this void we abide in, could shapes of ether, atoms or energy be the fundamental building blocks of our Universe?!</p>
      <p>The Flower of Life is 61 interconnecting circles as seen below. This may seem insignificant but these circles source all the perfect shapes in our Universe.</p>
      <Flower flower={ true }  />
      <p>When we remove the additional guiding circles fom The Flower of Life we see The Fruit of Life which is 13 perfectly touching cicles.</p>
      <Flower fruit={ true } />
      <p>When lines connect the centers of each circle in the Fruit of Life, Metatron's Cube is created.</p>
      <Flower fruit={ true } metatronsCube={ true } />
      <p>Metatron's Cube contains all of the Platonic Shapes or Solids. The Platonic Solids include all of the the perfectly symetrical shapes in our Universe (all angles and side lengths are equal).</p>
      <p>Yes Platonic as in Plato! Plato discussed these solids in his works, he taught that these geometrical forms each represent an element in our Universe and amazingly each Platonic Solid is contained in Metatron's cube. In other words Metatron's cube sources each Platonic Solid.</p>
      <p>Plato: <a href="https://mathshistory.st-andrews.ac.uk/Biographies/Plato/quotations/" target="_blank">"So their combinations with themselves and with each other give rise to endless complexities, which anyone who is to give a likely account of reality must survey."</a></p>
      <p style="margin-bottom: 0;">The triangle version of the Platonic Solids is the Merkaba! Notice all the equal angle and side length triangles within it below?! There are many spiritual ideas about what these shapes mean. I see them as fundamenatal, perfect & lovely repesentives of our Universe (aka our Home)!</p>
      <Flower merkaba={ true } />
    </div>

    <div class="me">
      <div class="header">
        <div class="papyrus one">About Me</div>
  
        <div class="logos">
          <!-- YouTube -->
          <a
            target="_blank"
            href="https://www.youtube.com/@FeelingLovelyNow"
            aria-label="Click here to view my YouTube page"
            on:mouseenter={ () => setPopoverVisiblity('youtube', true) }
            on:mouseleave={ () => setPopoverVisiblity('youtube', false) }>
            { #if popoverVisibility.youtube }
              <div transition:fade={{ duration: 150 }} class="popover">YouTube</div>
            { /if }
            { @html SVG_YOUTUBE }
          </a>
  
          <!-- Instagram -->
          <a
            target="_blank"
            href="https://instagram.com/feelinglovelynow"
            aria-label="Click here to view my YouTube page"
            on:mouseenter={ () => setPopoverVisiblity('instagram', true) }
            on:mouseleave={ () => setPopoverVisiblity('instagram', false) }>
            { #if popoverVisibility.instagram }
              <div transition:fade={{ duration: 150 }} class="popover">Instagram</div>
            { /if }
            { @html SVG_INSTAGRAM }
          </a>
  
          <!-- Patreon -->
          <a
            target="_blank"
            href="https://www.patreon.com/feelinglovelynow"
            aria-label="Click here to view my Patreon page"
            on:mouseenter={ () => setPopoverVisiblity('patreon', true) }
            on:mouseleave={ () => setPopoverVisiblity('patreon', false) }>
            { #if popoverVisibility.patreon }
              <div transition:fade={{ duration: 150 }} class="popover">Patreon</div>
            { /if }
            { @html SVG_PATREON }
          </a>
  
          <!-- Facebook -->
          <a
            target="_blank"
            href="https://facebook.com/feelinglovelynow"
            aria-label="Click here to view my FaceBook page"
            on:mouseenter={ () => setPopoverVisiblity('facebook', true) }
            on:mouseleave={ () => setPopoverVisiblity('facebook', false) }>
            { #if popoverVisibility.facebook }
              <div class="popover">FaceBook</div>
            { /if }
            { @html SVG_FACEBOOK }
          </a>
  
          <!-- Venmo -->
          <a
            target="_blank"
            href="https://venmo.com/u/feelinglovelynow"
            aria-label="Click here to view my Venmo page"
            on:mouseenter={ () => setPopoverVisiblity('venmo', true) }
            on:mouseleave={ () => setPopoverVisiblity('venmo', false) }>
            { #if popoverVisibility.venmo }
              <div class="popover">Venmo</div>
            { /if }
            { @html SVG_VENMO }
          </a>
  
          <!-- PayPal -->
          <a
            href="https://paypal.me/feelinglovelynow"
            target="_blank"
            aria-label="Click here to view my PayPal page"
            on:mouseenter={ () => setPopoverVisiblity('paypal', true) }
            on:mouseleave={ () => setPopoverVisiblity('paypal', false) }>
            { #if popoverVisibility.paypal }
              <div class="popover">PayPal</div>
            { /if }
            { @html SVG_PAYPAL }
          </a>
        </div>
      </div>

      <p>💜 Aloha! My name is Christopher Carrington, thanks for being here! I was born in New York, I currently live in Mount Shasta and I provide yoga, meditation and sound healing classes here!</p>
      <p>
        <span>💙 I also make</span>
        <a href="https://youtube.com/@FeelingLovelyNow" target="_blank">YouTube</a>
        <span>videos about</span>
        <a href="https://www.youtube.com/playlist?list=PLtjDq853eyCiOjlNGt9DzYWovUesimw5Z" target="_blank">Loving Self Mastery</a><span>!</span>
      </p>
      <p>💚 My email is chris@feelinglovelynow.com - Send me an email if you'd love to chat and/or if you are interested in a Coaching Call; where we can chat about how to transcend a struggle, how to accomplish a goal, and/or how to align with something you'd love to align with, maybe God, Joy, Peace, your heart, your passion and/or your goals please!</p>
    </div>
  </div>
</main>


<style lang="scss">
  @import '$lib/scss/variables.scss';

  #products {
    padding-top: 7rem; // smooth scroll padding
    margin-top: -7rem; // smooth scroll padding
    margin-bottom: 1.5rem;
  }

  #about {
    color: white;
    padding: 0 1.8rem;
    margin: 0 auto;
    max-width: 101rem;
    padding-top: 10.2rem; // smooth scroll padding
    margin-top: -10.2rem;  // smooth scroll padding

    .sacred {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1.8rem;

      p {
        width: 100%;
      }

      :global(svg) {
        margin-bottom: 0.9rem;
      }

      @media only screen and (min-width: 40rem) { // big screen
        align-items: start;
      }
    }

    .me {
      margin-bottom: 1.7rem;

      .header {
        display: flex;
        align-items: center;
        flex-direction: column;

        .logos,
        .papyrus {
          margin-bottom: 0.6rem;
        }

        @media only screen and (min-width: 40rem) { // big screen
          flex-direction: row;

          .logos,
          .papyrus {
            margin-bottom: 0;
          }
        }

        .logos {
          display: flex;
          align-items: center;
          transform: translateY(-0.6rem);
        }

        a {
          width: 3.3rem;
          height: 3.3rem;
          margin: 0 1.2rem;
          position: relative;

          @media only screen and (min-width: 40rem) { // big screen
            margin: 0 1.8rem;
          }

          .popover {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 4.2rem);
            color: var(--text-color);
            background-color: var(--opacity-bg);
            padding: 0.9rem;
            border-radius: 1.5rem;
            font-weight: 500;
          }

          :global(svg) {
            height: 100%;
            width: auto;
          }
        }
      }
    }

    p {
      margin: 0 0 1.2rem 0;
    }

    :global(svg) {
      width: 12rem;
      height: 12rem;
    }

    a {
      color: var(--gold-text-color);
    }
  }
</style>
