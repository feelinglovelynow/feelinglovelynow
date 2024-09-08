<script lang="ts">
  import type { Product } from '$lib'
  import Hero from '$lib/global/Hero.svelte'
  import Head from '$lib/global/Head.svelte'
  import { routeCatch } from '$lib/global/catch'
  import Flower from '$lib/sacred/Flower.svelte'
  import IMG_OG_HOME from '$lib/img/og/IMG_OG_HOME.jpg'
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
</script>


<Head title="Home" ogImageSrc={ IMG_OG_HOME } description="Welcome to Feeling Lovely Now!" />

<main class="initial">
  <Hero count={ 1 } />

  <div id="products">
  <FeaturedProducts { products }  />
  </div>

  <div id="about">
    <div class="papyrus one">About Me</div>

    <div class="p">💜 Aloha! My name is Christopher Carrington, thanks for being here! I was born in New York, I currently live in Mount Shasta and I provide yoga, meditation & sound healing classes here!</div>
    <div class="p">
      <span>💙 I also make</span>
      <a href="https://youtube.com/@FeelingLovelyNow" target="_blank">YouTube</a>
      <span>videos! I release a video every day and the theme is stories about</span>
      <a href="https://www.youtube.com/watch?v=KdSsMFtfbZ0&list=PLtjDq853eyCiOjlNGt9DzYWovUesimw5Z" target="_blank">Inner Conflict Solutions</a><span>!</span>
    </div>
    <div class="p">💚 My email is chris@feelinglovelynow.com - Send me an email if you'd love to chat or if you are interested in a Coaching Call; where we will chat about how to transcend a struggle, how to accomplish a goal, or how to align with something you'd love to align with, maybe God, Joy, Peace, your heart, your passion and/or your dream please!</div>
    <div class="p">
      <span>🧡 Here is my</span>
      <a href="https://www.patreon.com/feelinglovelynow" target="_blank">Patreon</a><span>!</span>
      <span>Please check it out if you'd love to support these daily Inner Conflict Solutions videos, thank you sooo much! 🥰</span>
    </div>
    <div class="p">
      <span>💛 Here is my</span>
      <a href="https://www.paypal.com/paypalme/feelinglovelynow" target="_blank">Paypal</a><span>!</span>
      <span>Please check it out if you'd love to support with a donation, thank you so much! 😀</span>
    </div>
    <div class="p">
      <span>❤️ & here is my</span>
      <a href="https://instagram.com/feelinglovelynow " target="_blank">Instagram</a><span>!</span>
      <span>Please feel free to send me a message! 🙏</span>
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
