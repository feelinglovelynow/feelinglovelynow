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
    <div>This site features a <LoadingAnchor href="/store" label="store" /> filled with lovely products, a <LoadingAnchor href="/library" label="library" /> filled with lovely information, and a <LoadingAnchor href="/links" label="links" /> page to contact me (Chris Carrington), access any of my socials and/or <a href="https://teams.live.com/meet/9355564920768" class="link" target="_blank">join my Gentle Yoga and Sound Healing classes live!</a></div>
  </div>
  
  <div class="item no-bottom">
    <div class="emoji">💜</div>
    <div>I hope you have a lovely day, Namaste!</div>
  </div>
</section>


<style lang="scss">
  .us {
    font-size: 2.1rem;
    max-width: 63rem;

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
