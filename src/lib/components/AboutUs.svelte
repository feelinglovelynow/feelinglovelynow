<script lang="ts">
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
</script>


<section class="us box-shadow">
  <div class="item">
    <div class="emoji">🌟</div>
    <div>Welcome to Feeling Lovely Now!</div>
  </div>
  <div class="item">
    <div class="emoji">💎</div>
    <div>Please feel free to visit our <LoadingAnchor href="/store" label="store" /> (lovely products), our <LoadingAnchor href="/library" label="library" /> (lovely info) or our <LoadingAnchor href="/links" label="links page" /> (for my contact info)! My name is Chris Carrington btw!</div>
  </div>
  
  <div class="item no-bottom">
    <div class="emoji">🕉</div>
    <div>Bare Necessities, Hakuna Matata, Go the Distance!</div>
  </div>
</section>


<style lang="scss">
  .us {
    line-height: 1.41;
    font-size: 2.1rem;
    max-width: 53.4rem;

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
