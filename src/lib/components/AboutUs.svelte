<script lang="ts">
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
</script>


<section class="us">
  <div class="item">
    <div class="emoji">🌟</div>
    <div>Welcome to Feeling Lovely Now!</div>
  </div>
  <div class="item">
    <div class="emoji">💎</div>
    <div>Please feel free to visit our <LoadingAnchor href="/store" label="store" /> filled with lovely products, our <LoadingAnchor href="/library" label="library" /> filled with lovely info, and our <LoadingAnchor href="/links" label="links" /> page filled with multiple ways to contact me (Chris Carrington)!</div>
  </div>
  
  <div class="item no-bottom">
    <div class="emoji">🕉</div>
    <div>Bare Necessities, Hakuna Matata, Go the Distance!</div>
  </div>
</section>


<style lang="scss">
  .us {
    font-size: 2.1rem;
    max-width: 60.4rem;

    .item {
      display: flex;
      align-items: start;
      margin-bottom: 0.6rem;
      &.no-bottom {
        margin-bottom: 0 !important;
      }

      .emoji {
        width: 3rem;
        min-width: 3rem;
        font-size: 2.3rem;
        margin-right: 0.18rem;
      }
    }
  }
</style>
