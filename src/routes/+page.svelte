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
    <div class="top">
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

    <div class="p">💜 Aloha! My name is Christopher Carrington, thanks for being here! I was born in New York, I currently live in Mount Shasta and I provide yoga, meditation & sound healing classes here!</div>
    <div class="p">
      <span>💙 I also make</span>
      <a href="https://youtube.com/@FeelingLovelyNow" target="_blank">YouTube</a>
      <span>videos about</span>
      <a href="https://www.youtube.com/playlist?list=PLtjDq853eyCiOjlNGt9DzYWovUesimw5Z" target="_blank">Loving Self Mastery</a><span>!</span>
    </div>
    <div class="p">💚 My email is chris@feelinglovelynow.com - Send me an email if you'd love to chat or if you are interested in a Coaching Call; where we will chat about how to transcend a struggle, how to accomplish a goal, or how to align with something you'd love to align with, maybe God, Joy, Peace, your heart, your passion and/or your dream please!</div>
    <div class="p">
      <span>🧡 Here is my</span>
      <a href="https://www.patreon.com/feelinglovelynow" target="_blank">Patreon</a><span>!</span>
      <span>Please check it out if you'd love to support these daily</span>
      <a href="https://www.youtube.com/playlist?list=PLtjDq853eyCiOjlNGt9DzYWovUesimw5Z" target="_blank">Loving Self Mastery</a>
      <span>videos, thank you sooo much! 🥰</span>
    </div>
    <div class="p">
      <span>💛 Here is my</span>
      <a href="https://venmo.com/u/feelinglovelynow" target="_blank">Venmo</a>
      <span>and </span>
      <a href="https://www.paypal.com/paypalme/feelinglovelynow" target="_blank">Paypal</a><span>!</span>
      <span>Please check it out if you would love to support with a donation, thank you sooo much!!! 😀</span>
    </div>
    <div class="p">
      <span>❤️ & here is my</span>
      <a href="https://instagram.com/feelinglovelynow " target="_blank">Instagram</a><span>!</span>
      <span>Please feel free to follow and/or send me a message! 🙏</span>
    </div>

    <div class="papyrus one" style="margin-top: 3rem;">About Sacred Geometry</div>
    <div class="p">Some believe that shapes are fundamental building blocks of our Universe. For example, when atoms make x shape, y happens.</div>
    <div class="p">The Flower of Life is 61 interconnecting circles.</div>
    <Flower flower={ true }  />
    <div class="p">This creates The Fruit of Life which is 13 perfectly touching cicles.</div>
    <Flower fruit={ true } />
    <div class="p">When lines connect the centers of each circle in the Fruit of Life, Metatron's Cube is created.</div>
    <Flower fruit={ true } metatronsCube={ true } />
    <div class="p">Metatron's Cube contains all of the Platonic Shapes, aka all of the the perfectly symetrical shapes in our Universe (all angles and side lengths are equal).</div>
    <div class="p">Yes Platonic as in Plato, Plato discussed these solids in his works and amazingly each Platonic Solid is contained in Metatron's cube. In other words Metatron's cube sources each Platonic Solid.</div>
    <div class="p">The triangle version of the Platonic Solids is the Merkaba! Notice all the equal angle and side length triangles?!</div>
    <Flower merkaba={ true } />
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
    max-width: 99rem;
    padding-top: 10.2rem; // smooth scroll padding
    margin-top: -10.2rem;  // smooth scroll padding

    .top {
      display: flex;
      align-items: center;

      .logos {
        display: flex;
        align-items: center;
      }

      a {
        width: 3.3rem;
        height: 3.3rem;
        margin: 0 1.8rem;
        position: relative;

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

    .p {
      margin-bottom: 1.2rem;
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
