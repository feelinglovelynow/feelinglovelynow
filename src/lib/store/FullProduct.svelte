<script lang="ts">
  import { cart, set } from '$lib/store/cart'
  import type { Product, OrderItem } from '$lib'
  import Flower from '$lib/sacred/Flower.svelte'
  import showToast from '@feelinglovelynow/toast'
  import IMG_TORUS from '$lib/img/IMG_TORUS.webp'
  import { enumOrderItemSize } from '$lib/global/enums'
  import ProductCategories from '$lib/store/ProductCategories.svelte'
  import { Modal, type ShowModal } from '@feelinglovelynow/svelte-modal'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'

  export let product: Product

  let size = ''
  let quantity = ''
  let showModal: ShowModal

  $: isBook = Boolean(product.description === 'HOW_TO_GET_HIGH')

  const sizes = [
    { value: '', name: 'Size' },
    { value: 'S', name: 'Small' },
    { value: 'M', name: 'Medium' },
    { value: 'L', name: 'Large' },
    { value: 'XL', name: 'X-Large' },
  ]

  function addToCart () {
    const errors = []

    if (isBook && !quantity) errors.push('Please select a quantity')
    else if (!isBook && !size && !quantity) errors.push('Please select a quantity and size')
    else if (!isBook && !size) errors.push('Please select a size')
    else if (!isBook && !quantity) errors.push('Please select a quantity')

    if (errors.length) showToast('info', errors)
    else {
      const cartItem: OrderItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        quantity: Number(quantity)
      }

      if (!isBook) cartItem.size = size as enumOrderItemSize

      $cart.push(cartItem)
      set($cart)
      showToast('success', `Shopping cart updated! <span class="link view-cart-link">View cart!</span>`)

      setTimeout(() => { // allow some time for the cart and toast to appear
        const links = document.querySelectorAll('.view-cart-link') as NodeListOf<Element> // link in the toast (there might be multiple toast showing)
        const button = document.querySelector('#shopping-cart-button button') as HTMLButtonElement // button to launch the shopping cart

        if (links.length && button) {
          for (const link of links) {
            link.addEventListener('click', () => button.click()) // on link click => the shopping cart button
          }
        }
      }, 300)
    }
  }
</script>


<div class="big-product">
  <Modal header={ product.name } on:functions={ e => showModal = e.detail.showModal }>
    <img src={ product.primaryImage.src } alt={ product.name }/>
  </Modal>
</div>

<section class="glow">
  <div class="image-categories">
    <button class="image" type="button" on:click={ showModal } title="Click to enlarge image">
      <img src={ product.primaryImage.src } alt={ product.name }/>
    </button>
    <ProductCategories categories={ product.categories } isAllShowing={ false } doActiveSelection={ false } location="full-product"/>
  </div>

  <div class="info">
    <div class="name">{ `$${ product.price } USD ⋅ ${ product.name }` }</div>

    <div class="purchase">
      <button class="brand" on:click={ addToCart }>Add to Cart</button>
      <div class="selects">
        <select name="quantity" value="" class="brand" on:change={ x => { quantity = x.currentTarget.value } }>
          <option value="" disabled>Quantity</option>
          { #each { length: 27 } as _, index }
            <option value={ index + 1 }>{ index + 1 }</option>
          { /each }
        </select>
        { #if !isBook }
        <select name="size" value="" class="brand" on:change={ x => { size = x.currentTarget.value } }>
          { #each sizes as { value, name } }
            <option { value } disabled={ value === '' }>{ name }</option>
          { /each }
        </select>
        { /if }
      </div>
    </div>

    <div class="description">
      { #if product.description === 'FLOWER_OF_LIFE' || product.description === 'METATRONS_CUBE' }
        <div class="geometry">
          <Flower flower={ true } flowerSurroundingCircle={ true } />
          <Flower fruit={ true } flowerSurroundingCircle={ true } />
          <Flower fruit={ true } metatronsCube={ true } flowerSurroundingCircle={ true }  />
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
      { :else if product.description === 'MERKABA' }
        <div class="geometry">
          <Flower flower={ true } flowerSurroundingCircle={ true }  />
          <Flower fruit={ true } flowerSurroundingCircle={ true }  />
          <Flower fruit={ true } merkaba={ true } flowerSurroundingCircle={ true }  />
        </div>
        <div>"The geometric energy fields around our bodies can be turned on in a particular way… When this field is turned on and spins, it is called a <strong>Mer-Ka-Ba</strong>, and its usefulness in this Reality is unparalleled. It gives us an expanded awareness of who we are, connects us with higher levels of consciousness and restores the memory of the infinite possibilities of our being."</div>
        <p>"The word <strong>Mer-Ka-Ba</strong> is made up of three smaller words, Mer, Ka and Ba, which, as we are using them, came from ancient Egyptian. It is seen in other cultures as <strong>merkabah, merkaba and merkavah</strong>. There are several pronunciations, but generally you pronounce it as if the three syllables are separate, with equal accents on each. Mer refers to a specific kind of light that was understood in Egypt only during the Eighteenth Dynasty. It was seen as two counterrotating fields of light spinning in the same space, which are generated by certain breathing patterns. Ka refers to the individual spirit and Ba refers to the spirit's interpretation of its particular reality. In our particular reality, Ba is usually defined as the body or physical reality. In other realities where spirits don't have bodies, it refers to their concepts or interpretation of the reality they bring with them. So the <strong>Mer-Ka-Ba</strong> is a counterrotating field of light that affects spirit and body simultaneously. It is a vehicle that can take spirit and body (or one's interpretation of reality) from one world or dimension into another, an interdimensional vehicle <strong>(Mer-Ka-Vah means chariot in Hebrew)</strong> that will help us return to our original higher state of consciousness."</p>
        <p>"<strong>Divine love</strong>, sometimes referred to as unconditional love, is <strong>the primary factor</strong> that allows the <strong>Mer-Ka-Ba</strong> to become a living field of light. Without divine love, the <strong>Mer-Ka-Ba</strong> is just a machine, and this machine will have limitations that will never allow the spirit that created it to return home and reach the highest levels of consciousness."</p>
        <p>"<strong>Connecting with the higher self is more important than learning to activate the Mer-Ka-Ba</strong>, because if you connect yourself to your Self, you will get absolutely clear information on how to proceed step by step through any reality and how to lead yourself back home into the full consciousness of God. When you connect with your higher self, the rest will happen automatically. You will still have to live your life, but everything you do will have great power and wisdom within your actions, thoughts and emotions."</p>
        <p>"It is now becoming clear that geometry - and thereby proportion - is the hidden law of nature. It is even more fundamental than mathematics, for all the laws of nature can be derived directly from sacred geometry. The geometries are located in the electromagnetic fields around your body that are about 55 feet in diameter. Remembering these fields is the beginning of human awakening, like a baby bird breaking into the light and out of the darkness inside its eggshell. The sacred and holy human lightbody, called the <strong>Mer-Ka-Ba</strong> by the ancients, becomes a reality."</p>
        <a target="_blank" href="https://www.amazon.com/Ancient-Secret-Flower-Life-Vol/dp/1891824171">Source</a>
      { :else if product.description === 'HOW_TO_GET_HIGH' }
        <div>Missed opportunities, was the theme of my life, thanks to erratic emotions. Common solutions like booze, mary jane or x, led me to experience less motor function, less will and sleep paralysis. Recently, gracefully and thankfully I’ve been guided to  simple, natural and efficient solutions, that are detailed in this tiny book. I dream this book, provides the <strong>scientific evidence</strong> and <strong>implementation guidance</strong>, for you to:</div>
        <ul>
          <li>Experience the <strong>highest</strong> level emotions that science has measured, which in ascending order are, love, joy, peace and enlightenment! </li>
          <li>Increase your emotional stability, mental acuity and physiological efficiency</li>
          <li>Improve your quality of life, mental health and immune system</li>
          <li>Increase your empathy (magnetic field information awareness)</li>
          <li>Feel united with our entire Universe</li>
          <li>And enhance your cognition!</li>
        </ul>
        <div class="light-bottom">If you would love, please feel free to <LoadingAnchor href="/links" label="contact me"/> (Chris Carrington)!</div>
        <div class="light-bottom">Edition: 11/11/23 · Written and Published in Mount Shasta California</div>
        <div class="light-bottom">Paper is 50% Recycled Paper and 50% Organic Hemp</div>
        <div>Hakuna Matata! 🙏</div>
      { :else if product.description === 'LOTUS' || product.description === 'TORUS' }
        <img class="torus" src={ IMG_TORUS } alt="Lady meditating in her torus field"/>
        <div>Our heart, generates our largest electromagnetic field; that surrounds body, fills body and is the shape of a <strong>torus</strong>.</div>
        { #if product.description === 'LOTUS' }
          <p>The <strong>Lotus of Life is our torus field</strong>; circles flowing outward from our center.</p>
        { /if }
        <p>A <strong>torus</strong> looks like a fountain in a pond that sprays water up and out from the center, then the water falls down to the pond and finally the water moves into the fountain and sprays up again.</p>
        <p>Energy in your torus field circles out top of heart, out top of head, around body, in base of spine and in base of heart</p>
        <p>The <strong>torus</strong> is the fundamental form of <strong>balanced energy flow</strong> found in sustainable systems at all scales.</p>
      { :else if product.description === 'HEART_LIGHT' }
        <div>The etheric field has been measured, it unites all in our Universe and according to Albert Einstein, space without ether is unthinkable</div>
        <p>Space is filled with ether, it flows through the atoms of our universe and to help us visualize the etheric field, think of ether as light</p>
        <p>We are in an ocean of light, some is visible light, some is subtle uniting light; all in our Universe, abides in light</p>
        <p>Once upon a time, body had one organ and that organ was your heart. At four weeks all four heart chambers are created and all else manifests outward from there. Your most fundamental organ, is your heart.</p>
        <p>Heart awareness is placing awareness at heart and leads to increased physiological efficiency, emotional stability and mental acuity</p>
      { :else if product.description === 'EMOTIONS' }
        <div>Feelings influence our bodies order, harmony and stability. According to science, positive emotions:</div>
        <ul>
          <li>Enhance energy</li>
          <li>Increase coherence</li>
          <li>Increased body efficiency</li>
          <li>Increased body effectiveness</li>
          <li>Increase our empathy (magnetic field information awareness)</li>
          <li>Lead us to radiate an electromagnetic field from our heart that contains a more coherent structure</li>
        </ul>
      { :else if product.description === 'UNITY' }
        <div>The etheric field has been measured, it unites all in our Universe and according to Albert Einstein, space without ether is unthinkable</div>
        <p>Space is filled with ether, it flows through the atoms of our universe and we may think of the etheric field as light</p>
        <p>We are in an ocean of light, some is visible light, some is subtle uniting light; all in our Universe, abides in light</p>
        <p>The space, that unites us all, is filled with light. The space, that surrounds your body, is filled with light. The space, that surrounds your atoms, is filled with light.</p>
        <p>Master Yoda told Luke Skywalker, "My ally is the Force, and a powerful ally it is... Its energy surrounds us and binds us. Luminous beings are we... Feel the Force flow around you"</p>
      { /if }
      <div class="fln__clear"></div>
    </div>
    
  </div>

  <div class="fln__clear"></div>
</section>


<style lang="scss">
  @import '$lib/scss/variables.scss';

  $image-swap-width: 900px;

  .big-product {
    :global(.fln__modal) {
      max-width: 117rem !important;
    }

    :global(img) {
      width: 100%;
    }

    :global(.fln__modal__header__text) {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  section {
    width: 100%;
    margin: 0 auto 0.9rem auto;
    max-width: 150rem;

    .image-categories {
      float: none;
      display: block;
      text-align: center;
      width: 100%;

      @media only screen and (min-width: $image-swap-width) { // big screen
        float: left;
        margin-right: 1.8rem;
        width: 54rem;
        transition: all 0.9s;
      }

      .image {
        display: flex;
        justify-content: center;
        aspect-ratio: 1/1;
        width: 100%;
        max-height: none;
        border: none;
        background: transparent;
        cursor: pointer;

        @media only screen and (min-width: $image-swap-width) { // big screen
          aspect-ratio: auto;
          width: 54rem;
          min-width: 54rem;
          transition: all 0.9s;
        }

        img {
          height: 100%;
          width: auto;

          @media only screen and (min-width: $image-swap-width) { // big screen
            width: 100%;
            height: auto;
          }
        }
      }

      :global(.chips) {
        padding: 0.6rem;
        margin-bottom: 0;
      }
    }

    .info {
      width: 100%;

      .name {
        text-align: center;
        font-weight: 500;
        font-size: 2.1rem;
        margin-bottom: 0.6rem;

        @media only screen and (min-width: $image-swap-width) { // big screen
          text-align: left;
        }
      }

      .purchase {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0.72rem;
        margin-bottom: 0.9rem;

        @media only screen and (min-width: $image-swap-width) { // big screen
          justify-content: start;
          flex-direction: row;
          transform: translateX(-1.4rem);
        }

        .selects {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand {
          width: 12rem;
          font-size: 1.8rem;
          white-space: nowrap;
          margin: 0.6rem 0.72rem; 

          @media only screen and (min-width: $image-swap-width) { // big screen
            margin-bottom: 0.3rem;
          }
        }
      }

      .description {
        width: 100%;

        .light-bottom {
          margin-bottom: 0.36rem;
        }

        .geometry {
          float: left;
          margin-right: 1.5rem;
        }

        .torus {
          float: left;
          width: 12rem;
          margin-right: 1.5rem;

          @media only screen and (min-width: $image-swap-width) { // big screen
          }
        }

        p,
        div {
          float: none;
        }

        ul {
          padding-top: 1.2rem;

          @media only screen and (min-width: $image-swap-width) { // big screen
            transform: translateX(3rem);
            padding-right: 3rem;
          }
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
</style>