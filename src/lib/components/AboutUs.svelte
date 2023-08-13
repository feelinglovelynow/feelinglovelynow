<script lang="ts">
  import { LoadingAnchor } from '@sensethenlove/svelte-loading-anchor'
</script>


<section class="us">
  <div class="item">
    <div class="emoji" style="font-size: 2.3rem">📚</div>
    <div>Welcome to our <LoadingAnchor href="/library" label="library" /> of lovely <LoadingAnchor href="/library?type=science" label="scientific evidence" />, <LoadingAnchor href="/library?type=product" label="products" /> & <LoadingAnchor href="/library?type=culture" label="culture" />, created by <LoadingAnchor href="/links" label="Chris Carrington" />!</div>
  </div>
</section>


<style lang="scss">
  .us {

    .item {
      display: flex;
      margin-bottom: 0;

      .emoji {
        width: 3rem;
        min-width: 3rem;
        font-size: 2.1rem;
        transform: translateY(-0.3rem);
      }
    }
  }
</style>
