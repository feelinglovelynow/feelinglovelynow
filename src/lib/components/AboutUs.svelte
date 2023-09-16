<script lang="ts">
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
</script>


<section class="us">
  <div class="item">
    <div class="emoji" style="font-size: 2.3rem">📚</div>
    <div>Welcome to our <LoadingAnchor href="/library" label="library" /> of lovely <LoadingAnchor href="/library?type=science" label="scientific evidence" />, <LoadingAnchor href="/library?type=product" label="products" /> & <LoadingAnchor href="/library?type=culture" label="culture" />, created by <LoadingAnchor href="/links" label="Chris Carrington" />!</div>
  </div>
  <div class="item">
    <div class="emoji" style="font-size: 2.3rem">🕉</div>
    <div>Chris ceated this <LoadingAnchor href="/library" label="library" /> for his Gentle Yoga & Sound Healing classes & all else who may love this information!</div>
  </div>
  <div class="item no-bottom">
    <div class="emoji" style="font-size: 2.3rem">🌈</div>
    <div>Thank you so much for being here, I hope you have a lovely day, Namaste!</div>
  </div>
</section>


<style lang="scss">
  .us {
    font-size: 2.1rem;

    .item {
      display: flex;
      margin-bottom: 0.6rem;

      .emoji {
        width: 3rem;
        min-width: 3rem;
        margin-right: 0.18rem;
      }
    }
  }
</style>
