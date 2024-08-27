<script lang="ts">
  import Button from '$lib/form/Button.svelte'
  import IMG_HERO from '$lib/img/IMG_HERO.webp'
  import SVG_CHEVRON_DOWN from '$lib/svg/SVG_CHEVRON_DOWN.svg'

  export let count: number
  export let isAbsolute: boolean = false
  export let showDown: boolean = true
  export let showContent: boolean = true
</script>


<div class="hero { isAbsolute ? 'absolute' : '' }">
  { #if showContent }
    <div class="hero__content background">
      <div class="hero__content__primary">Elevate Your Wardrobe</div>
      <div class="hero__content__secondary">Experience the Power of Sacred Geometry with Our 100% Organic Clothing!</div>
      <a href="#products">
        <Button text="Shop Now" css="large" />
      </a>
    </div>
  { /if }

  <div class="images">
    { #each { length: count } as _, i  }
      <img src={ IMG_HERO } alt="Merkaba" class="{ i !== 0 ? 'up' : '' }"/>
    { /each }
  </div>

  { #if showDown }
    <a href="#products" class="hero__down" type="button" aria-label="Scroll to products section">
      { @html SVG_CHEVRON_DOWN }
    </a>
  { /if }
</div>

<style lang="scss">
  @import '$lib/scss/variables.scss';

  $hero-img-height: 100vh;

  .hero {
    $hero-swap-viewport-width: 45rem;

    height: $hero-img-height;
    width: 100vw;
    &.absolute {
      position: absolute;
      z-index: 0;
      .images {
        position: absolute;
        top: -9.6rem;
        opacity: 0.6;
        min-height: $hero-img-height;
        max-height: $hero-img-height;
        width: 100vw; // Ensure the image is at least the width of the viewport
        height: auto; // Maintain aspect ratio
        position: absolute;
        z-index: $zindex-hero-img;
        left: 50%;
        transform: translate(-50%); // Center the image horizontally
        object-fit: cover; // Scale the image to cover the container, preserving aspect ratio
      }
    }

    img {
      min-height: $hero-img-height;
      max-height: $hero-img-height;
      width: 100%; // Ensure the image is at least the width of the viewport
      height: 100%; // Maintain aspect ratio
      // position: absolute;
      // z-index: $zindex-hero-img;
      // left: 50%;
      // transform: translate(-50%); // Center the image horizontally
      object-fit: cover; // Scale the image to cover the container, preserving aspect ratio
      &.up {
        margin-top: -1rem;
        margin-bottom: -1rem;
      }
    }

    &__content {
      position: absolute;
      z-index: $zindex-hero;
      top: 21rem;
      left: 1.8rem;
      right: 1.8rem;
      padding: 0.3rem 1.8rem 1.8rem 1.8rem;
      border-radius: 1.8rem;
      text-align: center;

      @media only screen and (min-width: $hero-swap-viewport-width) { // big screen
        top: 46vh;
        left: 6rem;
        right: auto;
        text-align: left;
      }

      @media only screen and (max-height: 26rem) { // small height screen
        top: 9.9rem;
        left: 1.8rem;
        right: 1.8rem;
        text-align: center;
      }

      a,
      :global(button) {
        @media only screen and (max-width: $hero-swap-viewport-width) { // small screen
          width: 100%;
        }
      }

      &__primary, &__secondary {
        color: white;
      }

      &__primary {
        font-size: 4.5rem;
        font-weight: 600;
        font-family: Avance-Bold;

        @media only screen and (min-width: $hero-swap-viewport-width) { // big screen
          font-size: 6rem;
        }
      }

      &__secondary {
        font-size: 2.1rem;
        margin-bottom: 1.2rem;
        line-height: 1.4;
        width: auto;

        @media only screen and (min-width: $hero-swap-viewport-width) { // big screen
          width: 57rem;
          font-size: 2.4rem;
        }
      }
    }

    &__down {
      position: absolute;
      z-index: $zindex-hero;
      bottom: 6rem;
      left: 50%;
      margin-left: -3rem;
      background-color: transparent;
      padding: 0;
      border: 0;
      animation: 2s ease-in-out 0s infinite normal none running hero__down;

      @media only screen and (min-width: $move-nav-window-width) { // big screen
        bottom: 0;
      }

      :global(svg) {
        color: white;
        width: 6rem;
        height: 6rem;
      }
    }

    @keyframes hero__down {
      0% {
        transform: translateY(-0.9rem);
      }

      50% {
        transform: translateY(0.9rem);
      }

      100% {
        transform: translateY(-0.9rem);
      }
    }
  }
</style>
