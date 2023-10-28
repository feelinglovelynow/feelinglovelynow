<script lang="ts">
  export let style: 'brand' | 'paypal' = 'brand'
</script>


<div class="wrapper { style }"> <!-- https://codepen.io/peiche/pen/XJXOxe -->
  <div class="wheel"></div>
</div>


<style lang="scss">
  .wrapper {
    position: relative;
    &.brand {
      .wheel {
        border-color: var(--gold-text-color) rgba(0,0,0,0) rgba(0,0,0,0);
      }
    }
    &.paypal {
      .wheel {
        border-color: lighten(#0070e0, 15%) #ccc #ccc;
      }
    }

    .wheel {
      height: 30px;
      width: 30px;
      border-width: 0.3rem;
      border-style: solid;
      border-radius: 100%;
      animation: rotation 0.8s infinite linear;
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    } to {
      transform: rotate(359deg);
    }
  }
</style>
