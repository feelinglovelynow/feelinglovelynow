<script lang="ts">
  import type { Product } from '$lib'
  import IMG_TORUS from '$lib/img/IMG_TORUS.webp'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
  import SVG_FLOWER_OF_LIFE from '$lib/svg/sacred/flower/component.svelte'

  export let product: Product

  $: image = product?.images?.length ? product.images[0] : null
  
  let showBookDescription: boolean
  let showLotusDescription: boolean
  let showMerkabaDescription: boolean
  let showFlowerMetatronDescription: boolean

  for (const category of product.categories) {
    if (category.slug === 'books') {
      showBookDescription = true
      break
    } else if (category.slug === 'merkaba') {
      showMerkabaDescription = true
      break
    } else if (category.slug === 'lotus-of-life') {
      showLotusDescription = true
      break
    } else if (category.slug === 'metatrons-cube' || category.slug === 'flower-of-life') {
      showFlowerMetatronDescription = true
      break
    }
  }
</script>

<div class="wrapper">
  <section>
    { #if image }
      <div class="image">
        <img src={ image.src } alt={ product.name }/>
      </div>
    { /if }

    <div class="info">
      <div class="name">{ `$${ product.price } USD ⋅ ${ product.name }` }</div>

      <div class="chips">
        <button class="brand">Add to Cart</button>
        { #each product.categories as category }
          <LoadingAnchor href={ `/store?category=${ category.slug }`} label={ category.name }  css="chip { false ? 'active' : '' }"/>
        {/each}
      </div>

      <div class="description">
        { #if showFlowerMetatronDescription }
          <div class="geometry">
            <SVG_FLOWER_OF_LIFE flower={ true }  />
            <SVG_FLOWER_OF_LIFE fruit={ true }  />
            <SVG_FLOWER_OF_LIFE fruit={ true } metatronsCube={ true }  />
          </div>
          <div>
            "The <strong>Flower of Life</strong> is not only found in Egypt, but all over the world… It is found in Ireland, Turkey, England, Israel, Egypt, China, Tibet, Greece and Japan."
          </div>  
          <p>"This pattern of thirteen circles is one of the holiest, most sacred forms in existence. On Earth it is called the <strong>Fruit of Life</strong>. It is called the fruit because it is the result, the fruit, from which the fabric of the details of the Reality were created… The simplest system comes forth by simply connecting all the centers of the circles with straight lines… If you do that, you end up with this pattern, which is known throughout the universe - everywhere - as <strong>Metatron's Cube</strong>. It is one of the most important informational systems in the universe, one of the basic creation patterns of existence."</p>
          <p>"A Platonic solid has certain characteristics by definition. First of all, its faces are all the same size. For instance, a cube, the most well-known of the Platonic solids, has a square on every face, so all its faces are the same size. Second, the edges of a Platonic solid are all the same length. Third, it has only one size of interior angles between faces. In the case of a cube, this angle is 90 degrees. And fourth, if a Platonic solid is put inside a sphere (of the right size), all the points will touch the surface of the sphere. With that definition, there are only four shapes besides the cube."</p>
          <p>"The five Platonic solids come from the first informational system of the <strong>Fruit of Life</strong>. Hidden within the lines of <strong>Metatron's Cube</strong> are all five of these shapes. When you look at <strong>Metatron's Cube</strong>, you're looking at all five Platonic solids at once."</p>
          <p>"The tetrahedron is considered fire, the cube is earth, the octahedron is air, the icosahedron is water and the dodecahedron is ether. (Ether, prana and tachyon energy are the same thing; they extend everywhere and are accessible at any point in space/time/dimension. This is the great secret of zero-point technology.) And the sphere is voidness. These six elements are the building blocks of the universe. They create the qualities of the universe."</p>
          <p>"There are all kinds of ways that atoms can join. The resulting molecules are always associated with the five Platonic solids… Even when you get into this complicated molecule and break it down, you see the shapes in it, and they always revert to one of the five Platonic solids it doesn't matter what the structure is. No matter what you call it - metal, crystal, anything else - will always come down to one of these original five shapes."</p>
          <a target="_blank" href="https://www.amazon.com/Ancient-Secret-Flower-Life-Vol/dp/1891824171">Source</a>
        { :else if showMerkabaDescription}
          <div class="geometry">
            <SVG_FLOWER_OF_LIFE flower={ true }  />
            <SVG_FLOWER_OF_LIFE fruit={ true }  />
            <SVG_FLOWER_OF_LIFE fruit={ true } merkaba={ true }  />
          </div>
          <div>"The geometric energy fields around our bodies can be turned on in a particular way… When this field is turned on and spins, it is called a <strong>Mer-Ka-Ba</strong>, and its usefulness in this Reality is unparalleled. It gives us an expanded awareness of who we are, connects us with higher levels of consciousness and restores the memory of the infinite possibilities of our being."</div>
          <p>"The word <strong>Mer-Ka-Ba</strong> is made up of three smaller words, Mer, Ka and Ba, which, as we are using them, came from ancient Egyptian. It is seen in other cultures as <strong>merkabah, merkaba and merkavah</strong>. There are several pronunciations, but generally you pronounce it as if the three syllables are separate, with equal accents on each. Mer refers to a specific kind of light that was understood in Egypt only during the Eighteenth Dynasty. It was seen as two counterrotating fields of light spinning in the same space, which are generated by certain breathing patterns. Ka refers to the individual spirit and Ba refers to the spirit's interpretation of its particular reality. In our particular reality, Ba is usually defined as the body or physical reality. In other realities where spirits don't have bodies, it refers to their concepts or interpretation of the reality they bring with them. So the <strong>Mer-Ka-Ba</strong> is a counterrotating field of light that affects spirit and body simultaneously. It is a vehicle that can take spirit and body (or one's interpretation of reality) from one world or dimension into another, an interdimensional vehicle <strong>(Mer-Ka-Vah means chariot in Hebrew)</strong> that will help us return to our original higher state of consciousness."</p>
          <p>"<strong>Divine love</strong>, sometimes referred to as unconditional love, is <strong>the primary factor</strong> that allows the <strong>Mer-Ka-Ba</strong> to become a living field of light. Without divine love, the <strong>Mer-Ka-Ba</strong> is just a machine, and this machine will have limitations that will never allow the spirit that created it to return home and reach the highest levels of consciousness."</p>
          <p>"<strong>Connecting with the higher self is more important than learning to activate the Mer-Ka-Ba</strong>, because if you connect yourself to your Self, you will get absolutely clear information on how to proceed step by step through any reality and how to lead yourself back home into the full consciousness of God. When you connect with your higher self, the rest will happen automatically. You will still have to live your life, but everything you do will have great power and wisdom within your actions, thoughts and emotions."</p>
          <p>"It is now becoming clear that geometry - and thereby proportion - is the hidden law of nature. It is even more fundamental than mathematics, for all the laws of nature can be derived directly from sacred geometry. The geometries are located in the electromagnetic fields around your body that are about 55 feet in diameter. Remembering these fields is the beginning of human awakening, like a baby bird breaking into the light and out of the darkness inside its eggshell. The sacred and holy human lightbody, called the <strong>Mer-Ka-Ba</strong> by the ancients, becomes a reality."</p>
          <a target="_blank" href="https://www.amazon.com/Ancient-Secret-Flower-Life-Vol/dp/1891824171">Source</a>
        { :else if showBookDescription }
          <div>During the 1980s, Harvard’s Dr Herbert Benson and his team, studied, measured and made a video of monks living in the Himalayan Mountains. The monks  repeatedly entered 40°F rooms, wrapped cold, wet blankets around their shoulders and dried the blankets; by raising their Body heat, with their Minds. The monks showed science that our thoughts can alter the functioning of our bodies. The secret is out, mind and body are united and this is only the beginning! My intention with this book is to help you naturally and efficiently optimize the unity between mind and body and experience a state I call getting High!</div>
          <p>High meaning, experiencing the highest level emotions that science has measured. Maybe you have experienced the lowest, shame and guilt; but this tiny book provides a natural and efficient map, for you to experience the highest levels measured; which in ascending order are, love, joy, peace and enlightenment! </p>
          <a target="_blank" href="https://news.harvard.edu/gazette/story/2002/04/meditation-changes-temperatures/">Source</a>
        { :else if showLotusDescription }
          <img class="torus" src={ IMG_TORUS } alt="Lady meditating in her torus field"/>
          <div>Our heart, generates our largest electromagnetic field; that surrounds body, fills body and is shaped like a <strong>torus</strong>.</div>
          <p>Energy flows within our <strong>toroidal field</strong> in this direction:</p>
          <ol>
            <li>Out top of heart</li>
            <li>Out top of our head</li>
            <li>Around body</li>
            <li>To the Earth</li>
            <li>In base of spine</li>
            <li>In bottom of heart</li>
          </ol>
          <p>The <strong>Lotus of Life</strong> is our torus field; circles flowing outward from the center.</p>
        { /if }
        <div class="clear"></div>
      </div>
      
    </div>
  </section>
</div>



<style lang="scss">
  $image-swap-width: 690px;

  .wrapper {
    width: 100%;
    max-width: 97vw;
    margin: 0 auto;

    section {
      display: flex;
      flex-direction: column;

      @media only screen and (min-width: $image-swap-width) { // big screen
        flex-direction: row;
      }

      .image {
        display: block;
        text-align: center;
        margin-right: 1.2rem;

        img {
          width: 30rem;
          transition: all 0.9s;
        }
      }

      .info {
        width: 100%;

        .name {
          text-align: center;
          font-weight: 500;
          font-size: 2.1rem;
          margin-bottom: 1.5rem;

          @media only screen and (min-width: $image-swap-width) { // big screen
            text-align: left;
          }
        }

        .chips {
          justify-content: center;
          margin-bottom: 1.5rem;

          .brand {
            width: 14.1rem;
            font-size: 1.8rem;
            margin-right: 0.72rem;
          }

          @media only screen and (min-width: $image-swap-width) { // big screen
            justify-content: start;
          }
        }

        .description {
          width: 100%;

          .geometry {
            float: left;
            margin-right: 1.5rem;
          }

          .torus {
            float: none;
            width: 100%;

            @media only screen and (min-width: $image-swap-width) { // big screen
              float: right;
              width: 20rem;
            }
          }

          .clear {
            clear: both;
          }

          p,
          div {
            float: none;
          }

          :global(svg) {
            width: 10.8rem;
            min-width: 10.8rem;
            height: 10.8rem;
            min-height: 10.8rem;
            display: block;
            margin-bottom: 1.5rem;
          }
        }
      }
    }
  }
</style>
