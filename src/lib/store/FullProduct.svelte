<script lang="ts">
  import { cart, set } from '$lib/store/cart'
  import type { Product, OrderItem } from '$lib'
  import Flower from '$lib/sacred/Flower.svelte'
  import IMG_TORUS from '$lib/img/IMG_TORUS.webp'
  import { showToast } from '@feelinglovelynow/toast'
  import IMG_SHIRT_SIZING_MEN from '$lib/img/shirtSizing/men.webp'
  import ProductCategories from '$lib/store/ProductCategories.svelte'
  import IMG_SHIRT_SIZING_WOMEN from '$lib/img/shirtSizing/women.webp'
  import { Modal, type ShowModal } from '@feelinglovelynow/svelte-modal'
  import { LoadingAnchor } from '@feelinglovelynow/svelte-loading-anchor'
  import { enumOrderItemSize, enumProductDescription } from '$lib/global/enums'

  export let product: Product

  let size = ''
  let quantity = ''
  let isBook = false
  let topDescription = ''
  let isMensShirt = false
  let isWomensShirt = false
  let inchesVisislbe = true
  let showSizeGuideModal: ShowModal
  let showBigProductModal: ShowModal
  let showRefundPolicyModal: ShowModal

  $: if (product.categories) {
    for (const category of product.categories) {
      switch (category.slug) {
        case 'books':
          isBook = true
          break
        case 'mens-clothing':
          isMensShirt = true
          topDescription = "This high-quality, regular fit and extra comfortable Men's T-Shirt is 100% organic ring spun cotton, gold embroidered and perfect for organic shoppers!"
          break
        case 'womens-clothing':
          isWomensShirt = true
          topDescription = "This high-quality, slim fit and extra comfortable Women's T-Shirt is 100% organic cotton, gold embroidered and perfect for organic shoppers!"
          break
      }
    }
  }

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
        uid: crypto.randomUUID(),
        productUid: product.uid,
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
  <Modal header={ product.name } on:functions={ e => showBigProductModal = e.detail.showModal }>
    <img src={ product.primaryImage.src } alt={ product.name }/>
  </Modal>
</div>

<div class="refund-policy">
  <Modal header="Refund Policy" on:functions={ e => showRefundPolicyModal = e.detail.showModal }>
    <div class="head">To get complete a refund:</div>
    <ol>
      <li>Email us@feelinglovelynow.com the order items you would love to return within 120 days of purchase</li>
      <li>We send you return address information</li>
      <li>We recieve the items within 150 days of the purchase and verify the items are in good quality</li>
      <li>We send you a refund for the items sub total + shipping to you + sales tax + $9 for shipping back to us</li>
    </ol>
  </Modal>
</div>

<div class="size-guide">
  <Modal header="Size Guide" on:functions={ e => showSizeGuideModal = e.detail.showModal }>
    { #if isMensShirt }
      <div class="toggle">
        <button on:click={ () => inchesVisislbe = true } class="link { inchesVisislbe ? 'active' : '' }" type="button">Inches</button>
        <span class="fln__pr-text">⋅</span>
        <button on:click={ () => inchesVisislbe = false } class="link { !inchesVisislbe ? 'active' : '' }" type="button">Centimeters</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th class="center">Length</th>
            <th class="center">Width</th>
            <th class="right">Sleeve Length</th>
          </tr>
        </thead>
        <tbody>
          { #if inchesVisislbe }
            <tr>
              <td>Small</td>
              <td class="center">27 ¼</td>
              <td class="center">19 ¼</td>
              <td class="right">8 ⅛</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td class="center">28 ¼</td>
              <td class="center">20 ½</td>
              <td class="right">8 ½</td>
            </tr>
            <tr>
              <td>Large</td>
              <td class="center">29 ⅛</td>
              <td class="center">21 ¾</td>
              <td class="right">8 ⅞</td>
            </tr>
            <tr>
              <td>X-Large</td>
              <td class="center">29 ⅞</td>
              <td class="center">22 ¾</td>
              <td class="right">8 ⅞</td>
            </tr>
          { :else }
            <tr>
              <td>Small</td>
              <td class="center">69</td>
              <td class="center">49</td>
              <td class="right">20.6</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td class="center">72</td>
              <td class="center">52</td>
              <td class="right">21.6</td>
            </tr>
            <tr>
              <td>Large</td>
              <td class="center">74</td>
              <td class="center">55</td>
              <td class="right">22.6</td>
            </tr>
            <tr>
              <td>X-Large</td>
              <td class="center">76</td>
              <td class="center">58</td>
              <td class="right">22.6</td>
            </tr>
          { /if }
        </tbody>
      </table>

      <div class="sizing">
        <img src={ IMG_SHIRT_SIZING_MEN } alt="Men sizing diagram" />
        <div class="info">
          <div class="title first">A Length</div>
          <div>From the collar at top of tee to the bottom of the shirt</div>
          <div class="title">B Chest</div>
          <div>Around the fullest part of chest</div>
          <div class="title">C Sleeve length</div>
          <div>From the top of the set-in sleeve to the hem of the sleeve</div>
        </div>
      </div>
    { :else }
      <div class="toggle">
        <button on:click={ () => inchesVisislbe = true } class="link { inchesVisislbe ? 'active' : '' }" type="button">Inches</button>
        <span class="fln__pr-text">⋅</span>
        <button on:click={ () => inchesVisislbe = false } class="link { !inchesVisislbe ? 'active' : '' }" type="button">Centimeters</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th class="center">Length</th>
            <th class="right">Width</th>
          </tr>
        </thead>
        <tbody>
          { #if inchesVisislbe }
            <tr>
              <td>Small</td>
              <td class="center">25 ¼</td>
              <td class="right">16 ⅛</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td class="center">26</td>
              <td class="right">17 ¼</td>
            </tr>
            <tr>
              <td>Large</td>
              <td class="center">26 ¾</td>
              <td class="right">18 ½</td>
            </tr>
            <tr>
              <td>X-Large</td>
              <td class="center">27 ⅝</td>
              <td class="right">19 ¾</td>
            </tr>
          { :else }
            <tr>
              <td>Small</td>
              <td class="center">64</td>
              <td class="right">41</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td class="center">66</td>
              <td class="right">44</td>
            </tr>
            <tr>
              <td>Large</td>
              <td class="center">67.8</td>
              <td class="right">47</td>
            </tr>
            <tr>
              <td>X-Large</td>
              <td class="center">70</td>
              <td class="right">50</td>
            </tr>
          { /if }
        </tbody>
      </table>

      <div class="sizing">
        <img src={ IMG_SHIRT_SIZING_WOMEN } alt="Women sizing diagram" />
        <div class="info">
          <div class="title first">A Length</div>
          <div>From the collar at the top of the tee (Highest Point Shoulder) to the bottom of the shirt</div>
          <div class="title">B Width</div>
          <div>From the seam under the sleeve to the seam under the opposite sleeve</div>
        </div>
      </div>
    { /if }
  </Modal>
</div>


<section class="glow">
  <div class="image-categories">
    <button class="image" type="button" on:click={ showBigProductModal } title="Click to enlarge image">
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
      <div class="links">
        { #if !isBook }
          <button on:click={ () => showSizeGuideModal() } class="link" type="button">Size Guide</button>
          <div class="dot">⋅</div>
        { /if }
        <button on:click={ () => showRefundPolicyModal() } class="link" type="button">Refund Policy</button>
      </div>
    </div>

    <div class="description">
      { #if product.description === enumProductDescription.FLOWER_OF_LIFE || product.description === enumProductDescription.METATRONS_CUBE }
        <div class="geometry">
          <Flower flower={ true } flowerSurroundingCircle={ true } />
          <Flower fruit={ true } flowerSurroundingCircle={ true } />
          <Flower fruit={ true } metatronsCube={ true } flowerSurroundingCircle={ true }  />
        </div>
        <div>{ topDescription }</div>
        <p>"The <strong>Flower of Life</strong> is not only found in Egypt, but all over the world… It is found in Ireland, Turkey, England, Israel, Egypt, China, Tibet, Greece and Japan."</p>  
        <p>"This pattern of thirteen circles is one of the holiest, most sacred forms in existence. On Earth it is called the <strong>Fruit of Life</strong>. It is called the fruit because it is the result, the fruit, from which the fabric of the details of the Reality were created… The simplest system comes forth by simply connecting all the centers of the circles with straight lines… If you do that, you end up with this pattern, which is known throughout the universe - everywhere - as <strong>Metatron's Cube</strong>. It is one of the most important informational systems in the universe, one of the basic creation patterns of existence."</p>
        <p>"A Platonic solid has certain characteristics by definition. First of all, its faces are all the same size. For instance, a cube, the most well-known of the Platonic solids, has a square on every face, so all its faces are the same size. Second, the edges of a Platonic solid are all the same length. Third, it has only one size of interior angles between faces. In the case of a cube, this angle is 90 degrees. And fourth, if a Platonic solid is put inside a sphere (of the right size), all the points will touch the surface of the sphere. With that definition, there are only four shapes besides the cube."</p>
        <p>"The five Platonic solids come from the first informational system of the <strong>Fruit of Life</strong>. Hidden within the lines of <strong>Metatron's Cube</strong> are all five of these shapes. When you look at <strong>Metatron's Cube</strong>, you're looking at all five Platonic solids at once."</p>
        <p>"The tetrahedron is considered fire, the cube is earth, the octahedron is air, the icosahedron is water and the dodecahedron is ether. (Ether, prana and tachyon energy are the same thing; they extend everywhere and are accessible at any point in space/time/dimension. This is the great secret of zero-point technology.) And the sphere is voidness. These six elements are the building blocks of the universe. They create the qualities of the universe."</p>
        <p>"There are all kinds of ways that atoms can join. The resulting molecules are always associated with the five Platonic solids… Even when you get into this complicated molecule and break it down, you see the shapes in it, and they always revert to one of the five Platonic solids it doesn't matter what the structure is. No matter what you call it - metal, crystal, anything else - will always come down to one of these original five shapes."</p>
        <a target="_blank" href="https://www.amazon.com/Ancient-Secret-Flower-Life-Vol/dp/1891824171">Source</a>
      { :else if product.description === enumProductDescription.MERKABA }
        <div class="geometry">
          <Flower flower={ true } flowerSurroundingCircle={ true }  />
          <Flower fruit={ true } flowerSurroundingCircle={ true }  />
          <Flower fruit={ true } merkaba={ true } flowerSurroundingCircle={ true }  />
        </div>
        <div>{ topDescription }</div>
        <p>"The geometric energy fields around our bodies can be turned on in a particular way… When this field is turned on and spins, it is called a <strong>Mer-Ka-Ba</strong>, and its usefulness in this Reality is unparalleled. It gives us an expanded awareness of who we are, connects us with higher levels of consciousness and restores the memory of the infinite possibilities of our being."</p>
        <p>"The word <strong>Mer-Ka-Ba</strong> is made up of three smaller words, Mer, Ka and Ba, which, as we are using them, came from ancient Egyptian. It is seen in other cultures as <strong>merkabah, merkaba and merkavah</strong>. There are several pronunciations, but generally you pronounce it as if the three syllables are separate, with equal accents on each. Mer refers to a specific kind of light that was understood in Egypt only during the Eighteenth Dynasty. It was seen as two counterrotating fields of light spinning in the same space, which are generated by certain breathing patterns. Ka refers to the individual spirit and Ba refers to the spirit's interpretation of its particular reality. In our particular reality, Ba is usually defined as the body or physical reality. In other realities where spirits don't have bodies, it refers to their concepts or interpretation of the reality they bring with them. So the <strong>Mer-Ka-Ba</strong> is a counterrotating field of light that affects spirit and body simultaneously. It is a vehicle that can take spirit and body (or one's interpretation of reality) from one world or dimension into another, an interdimensional vehicle <strong>(Mer-Ka-Vah means chariot in Hebrew)</strong> that will help us return to our original higher state of consciousness."</p>
        <p>"<strong>Divine love</strong>, sometimes referred to as unconditional love, is <strong>the primary factor</strong> that allows the <strong>Mer-Ka-Ba</strong> to become a living field of light. Without divine love, the <strong>Mer-Ka-Ba</strong> is just a machine, and this machine will have limitations that will never allow the spirit that created it to return home and reach the highest levels of consciousness."</p>
        <p>"<strong>Connecting with the higher self is more important than learning to activate the Mer-Ka-Ba</strong>, because if you connect yourself to your Self, you will get absolutely clear information on how to proceed step by step through any reality and how to lead yourself back home into the full consciousness of God. When you connect with your higher self, the rest will happen automatically. You will still have to live your life, but everything you do will have great power and wisdom within your actions, thoughts and emotions."</p>
        <p>"It is now becoming clear that geometry - and thereby proportion - is the hidden law of nature. It is even more fundamental than mathematics, for all the laws of nature can be derived directly from sacred geometry. The geometries are located in the electromagnetic fields around your body that are about 55 feet in diameter. Remembering these fields is the beginning of human awakening, like a baby bird breaking into the light and out of the darkness inside its eggshell. The sacred and holy human lightbody, called the <strong>Mer-Ka-Ba</strong> by the ancients, becomes a reality."</p>
        <a target="_blank" href="https://www.amazon.com/Ancient-Secret-Flower-Life-Vol/dp/1891824171">Source</a>
      { :else if product.description === enumProductDescription.WHO_AM_I }
        <div class="big-bottom">
          <span class="fln__pr-text">I</span><strong class="fln__pr-text">dream</strong><span class="fln__pr-text">this book helps you</span><strong class="fln__pr-text">blissfully</strong><span class="fln__pr-text">jack</span><strong class="fln__pr-text">out</strong><span class="fln__pr-text">of the</span><strong class="fln__pr-text">Matrix</strong><span class="fln__pr-text">aka the Universe aka Spacetime. This book explains three ways how</span><strong class="fln__pr-text">all</strong><span class="fln__pr-text">humans on Earth are</span><strong>connected</strong><span class="fln__pr-text">, how your</span><strong class="fln__pr-text">mind</strong><span class="fln__pr-text">is connected with your</span><strong class="fln__pr-text">body</strong><span class="fln__pr-text">and how your</span><strong class="fln__pr-text">mind</strong><span class="fln__pr-text">is connected to</span><strong>others</strong><span class="fln__pr-text">, via</span><strong>empathy</strong><span class="fln__pr-text">. Then we explore</span><strong>optimal thoughts</strong><span class="fln__pr-text">, since they</span><strong class="fln__pr-text">affect a lot, where</strong><span class="fln__pr-text">your</span><strong class="fln__pr-text">mind is</strong><span class="fln__pr-text">and how to establish a</span><strong>connection beyond Spacetime</strong><span class="fln__pr-text">!</span><strong>Are you ready</strong><span class="fln__pr-text">!?</span>
        </div>
        <div class="big-bottom">By Christopher Alexander Carrington (<LoadingAnchor href="/links" label="contact me"/>)</div>
        <div class="light-bottom">Paper is 50% Recycled Paper and 50% Organic Hemp</div>
        <div class="light-bottom">Edition: 12/19/23 · Written and Published in Mount Shasta</div>
        <div>💚 Intention ⋅ Good of all please!</div>
      { :else if product.description === enumProductDescription.LOTUS || product.description === enumProductDescription.TORUS }
        <img class="torus" src={ IMG_TORUS } alt="Lady meditating in her torus field"/>
        <div>{ topDescription }</div>
        <p>Our heart, generates our largest electromagnetic field; that surrounds body, fills body and is the shape of a <strong>torus</strong>.</p>
        { #if product.description === enumProductDescription.LOTUS }
          <p>The <strong>Lotus of Life is our torus field</strong>; circles flowing outward from our center</p>
        { /if }
        <p>A <strong>torus</strong> looks like a fountain in a pond that sprays water up and out from the center, then the water falls down to the pond and finally the water moves into the fountain and sprays up again</p>
        <p>Energy in your torus field circles out top of heart, out top of head, around body, in base of spine and in base of heart</p>
        <p>The <strong>torus</strong> is the fundamental form of <strong>balanced energy flow</strong> found in sustainable systems at all scales</p>
      { :else if product.description === enumProductDescription.HEART_LIGHT }
        <div>{ topDescription }</div>
        <p>Light is electromagnetic radiation that is visible or not visible and most of our Universes light is invisible to our eyes</p>
        <p>How much energy light has and if light is visible, is determined by its frequency</p>
        <p>Our Sun emits light that is visible and not visible (ultraviolet to near infrared)</p>
        <p>Our Earth emits light that is not visible (infrared)</p>
        <p>Thoughts about gathering and directing prana (invisible light), lead to mental health, quality of life and immune system benefits</p>
        <p>Heart awareness is placing focus and prana (via thoughts) at heart and leads to increased emotional stability, physiological efficiency and mental acuity</p>
        <p>Heart awareness also helps us relax, be highly aware and strengthen the communication link between our brain and our heart</p>
      { :else if product.description === enumProductDescription.EMOTIONS }
        <div>{ topDescription }</div>
        <div style="padding-top: 1.2rem;">Feelings influence our bodies order, harmony and stability. According to science, positive emotions:</div>
        <ul>
          <li>Enhance energy</li>
          <li>Increase coherence</li>
          <li>Increased body efficiency</li>
          <li>Increased body effectiveness</li>
          <li>Increase our empathy (magnetic field information awareness)</li>
          <li>Lead us to radiate an electromagnetic field from our heart that contains a more coherent structure</li>
        </ul>
      { :else if product.description === enumProductDescription.UNITY }
        <div>{ topDescription }</div>
        <p>During his talk at the University of Leiden in 1920 Albert Einstein said “There exists an ether. According to the general theory of relativity, space without ether is unthinkable; for in such space there not only would be no propagation of light, but also no possibility of existence”</p>
        <p>“American physicist Willis Lamb was measuring the spectrum of hydrogen, German American physicist Hans Bethe realized that the measurements showed a quantum field interaction, the quantum field, the zero point field and ether are the same thing.”</p>
        <p>Just like how water unites all in the ocean, be aware that the space surrounding your atoms is filled with the uniting field, be aware that the space that surrounds your body is filled with the uniting field and be aware that the space that unites all in our Universe is filled with the uniting field</p>
        <p>Because space without Ether is unthinkable, know that Reality is Unity!</p>
      { :else if product.description === enumProductDescription.SEED_OF_LIFE }
        <div class="geometry">
          <Flower flower={ true } flowerSurroundingCircle={ true } />
          <Flower genesis={ true } />
          <Flower genesis={ true } genesisSurroundingCircle={ true } />
        </div>
        <div>{ topDescription }</div>
        <p>"In the middle of the Flower of Life are seven interconnected circles which, if you take them out and draw a circle around them, would create the image called the Seed of Life.</p>
        <p>Christian and the Egyptian understandings of Reality are almost identical. Here are the first three sentences of the Christian Bible: 'In the beginning God created the heaven and the earth. And the earth was without form and void, and darkness was upon the face of the deep, and the spirit of God moved upon the face of the waters. And God said, Let there be light, and there was light.'</p>
        <p>Both Egyptian and Christian religions believe that all that is needed to start the process of creation is nothing and spirit, and when those two concepts are brought together, then all things can be created.</p>
        <p>In order to understand the process of creation on the deepest level, Egyptian students were told to imagine and enact the process we are about to go through. The following description is how they explained and practiced it in their mystery schools.</p>
        <p>Spirit shoots a beam of consciousness out into the Void. It shoots this beam first to the front, then to the back, then to the left, then the right, then straight up and straight down. In the mystery schools, after they've projected these six beams in the six directions, the next thing they do is connect the ends of these projections.</p>
        <p>The octahedron the students created this way had three axes front to back, left to right, and up and down. They were told to spin the shape around one of the axes, it didn't matter which, and it didn't matter which direction. Before the students were allowed to move their own point of consciousness, they were taught to spin this octahedral form and create a sphere around themselves.</p>
        <p>Remember that spirit is now sitting in a sphere. The instructions are to move to that which is newly created, then project another sphere exactly like the first. Since nothing exists except this bubble in the Void, and the inside of the bubble is the same as the outside, the only thing thatís new or different is the membrane itself, the surface of the sphere.</p>
        <p>So once it arrives on the surface, it makes another octahedron, spins it through the three axes and forms another sphere identical in size to the first one. Itís identical in size because its ability to project into the Void is the same. Nothing has changed in that respect. So it creates a second sphere exactly the same size as the first.</p>
        <p>When it does that, it has done something that, in terms of sacred geometry, is very special. It has formed a vesica piscis at the intersection of the two spheres.</p>
        <p>After that pattern is created, thereís only one instruction left to followóforever. The only other action to be taken until the end of time is always to move to the innermost circle point(s) and project another sphere.</p>
        <p>The last circle forms a complete six-petaled flower. This is what many of the earlier Bibles meant when they said, 'In the beginning there were six.' Our Bible now says that creation was formed in six days, and this fits exactly. This is the pattern of Genesis, so we refer to it as the Genesis pattern. Itís the beginning of the creation of this universe we live in."</p>
        <a target="_blank" href="https://www.amazon.com/Ancient-Secret-Flower-Life-Vol/dp/1891824171">Source</a>
    { /if }
      <div class="fln__clear"></div>
    </div>
    
  </div>

  <div class="fln__clear"></div>
</section>


<style lang="scss">
  @import '$lib/scss/variables.scss';

  $image-swap-width: 900px;

  .refund-policy {
    :global(.fln__modal) {
      max-width: 90rem !important;
    }

    .head {
      padding: 0.3rem 0 0.6rem 0;
    }
  }

  .size-guide {
    :global(.fln__modal) {
      max-width: 64.2rem !important;
    }

    .toggle {
      width: 100%;
      text-align: center;
      margin-bottom: 0.6rem;
      font-size: 2.1rem;

      .link {
        &.active {
          text-decoration: underline;
        }
      }
    }

    table {
      width: 100%;
      margin-bottom: 1.5rem;

      th,
      td {
        width: 25%;
        &.right {
          text-align: right;
        }
        &.center {
          text-align: center;
        }
      }

      th {
        white-space: nowrap;
      }
    }

    .sizing {
      display: flex;
      flex-direction: column;

      img {
        width: 100%;
        margin-bottom: 1.2rem;
      }

      @media only screen and (min-width: 600px) { // big screen
        flex-direction: row;

        img {
          width: auto;
          margin-bottom: 0;
        }
      }

      .info {
        transform: translateY(-0.6rem);

        .title {
          font-size: 2.1rem;
          font-weight: 600;
          margin: 1.8rem 0 0.3rem 0;
          &.first {
            margin-top: 0;
          }
        }
      }
    }
  }

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
        width: 100%;
        aspect-ratio: 1/1;
        max-height: none;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: all 0.9s;

        @media only screen and (min-width: $image-swap-width) { // big screen
          aspect-ratio: auto;
          height: 54rem;
          width: 54rem;
          min-width: 54rem;
        }

        img {
          width: 100%;
          height: auto;

          @media only screen and (min-width: $image-swap-width) { // big screen
            height: 54rem;
            width: 54rem;
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

        @media only screen and (min-width: $image-swap-width) { // big screen
          text-align: left;
        }
      }

      .purchase {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        flex-wrap: wrap;
        margin: 0.9rem 0 1.2rem 0;

        @media only screen and (min-width: $image-swap-width) { // big screen
          justify-content: start;
          flex-direction: row;
        }

        .links,
        .selects {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .links {
          .dot {
            margin: 0 0.6rem;
          }

          .link {
            padding: 0.9rem 0;
            white-space: nowrap;
          }
        }

        .brand {
          width: 12rem;
          font-size: 1.8rem;
          white-space: nowrap;
          margin: 0.6rem 0;
          &[name="size"] {
            margin-left: 1.2rem;

             @media only screen and (min-width: $image-swap-width) { // big screen
              margin-left: 0;
             }
          }

          @media only screen and (min-width: $image-swap-width) { // big screen
            margin: 0.6rem 1.2rem 0.6rem 0;
          }
        }
      }

      .description {
        width: 100%;

        .big-bottom {
          margin-bottom: 0.63rem;
        }

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
