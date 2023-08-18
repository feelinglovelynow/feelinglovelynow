<script lang="ts">
  import IMG_GUITAR from '$lib/img/IMG_GUITAR.webp'
</script>


<div class="profile-pic">
  <div class="img">
    <img src={ IMG_GUITAR } alt="Chris Carrington playing guitar" />
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
        width: 111%;
        transform: translate(0rem, -7.9rem);
      }
    }
  }
</style>
