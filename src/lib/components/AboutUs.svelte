<script lang="ts">
  import { page } from '$app/stores'
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
</script>


<section class="us">
  <div class="item">
    <div class="emoji">📚</div>
    <div>
      Welcome to our <LoadingAnchor href="/library" label="library" /> of lovely <LoadingAnchor href="/library?type=science" label="scientific evidence" />, <LoadingAnchor href="/library?type=product" label="products" /> & <LoadingAnchor href="/library?type=culture" label="culture" />, created by
      {#if $page.route.id !== '/links' }
        <LoadingAnchor href="/links" label="Chris Carrington" />!
      { :else }
        Chris Carrington!
      { /if }
    </div>
  </div>
  <div class="item">
    <div class="emoji">🌟</div>
    <div>Chris ceated this <LoadingAnchor href="/library" label="library" /> for his Gentle Yoga & Sound Healing classes & all else who may love this information!</div>
  </div>
  <div class="item no-bottom">
    <div class="emoji">☯️</div>
    <div>I hope you have a lovely day, Namaste!</div>
  </div>
</section>


<style lang="scss">
  .us {
    font-size: 2.1rem;

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
