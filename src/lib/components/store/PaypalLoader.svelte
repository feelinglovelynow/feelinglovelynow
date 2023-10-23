<div></div> <!-- https://codepen.io/peiche/pen/XJXOxe -->


<style lang="scss">
  div {
    position: relative;
  }

  div:before {
    content: "";
    height: 30px;
    width: 30px;
    position: absolute;
    top: 0;
    left: 0;
    border-width: 0.3rem;
    border-style: solid;
    border-color: lighten(#0070e0, 15%) #ccc #ccc;
    border-radius: 100%;
    animation: rotation 0.8s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    } to {
      transform: rotate(359deg);
    }
  }
</style>
