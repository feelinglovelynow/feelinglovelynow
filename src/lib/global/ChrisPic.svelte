<script lang="ts">
  import IMG_CHRIS from '$lib/img/IMG_CHRIS.webp'
</script>


<div class="profile-pic">
  <div class="img glow">
    <img src={ IMG_CHRIS } alt="Chris Carrington playing" />
  </div>
</div>


<style lang="scss">
  .profile-pic {
    display: flex;
    justify-content: center;

    .img {
      height: 9rem;
      width: 9rem;
      border-radius: 50%;
      overflow: hidden;
      aspect-ratio: 1/1;
      margin-bottom: 1.5rem;

      img {
        height: 111%;
        transform: translate(-0.6rem, -0.12rem);
      }
    }
  }
</style>
