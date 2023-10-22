<script lang="ts">
  const width = 500
  const height = 500

  export let strokeWidth = 6.3
  export let color = 'rgb(234, 198, 3)'

  $: radius = diameter / 2
  $: center = height / 2
  $: diameter = 246
  $: percent83 = diameter * 0.83333
  $: percent16 = diameter * 0.16666
  $: percent33 = diameter * 0.33333
  $: viewBox = `-${ diameter / 2 } 0 ${ width } ${ height }`
</script>


<svg xmlns="http://www.w3.org/2000/svg" class="logo__lotus" { viewBox } { width } { height }>
  <g fill="none" stroke-width="{ strokeWidth }px" stroke={ color }>
    <circle r={ radius } cx={ center } cy={ center }></circle> <!-- right -->
    <circle r={ radius } cx={ center - diameter } cy={ center }></circle> <!-- left -->
    <circle r={ radius } cx={ center - radius } cy={ center - radius }></circle> <!-- top -->
    <circle r={ radius } cx={ center - radius } cy={ center + radius }></circle> <!-- bottom -->

    <circle r={ radius } cx={ center - percent16 } cy={ center - percent33 }></circle> <!-- top right -->
    <circle r={ radius } cx={ center - percent83 } cy={ center - percent33 }></circle> <!-- top left -->
    <circle r={ radius } cx={ center - percent83 } cy={ center + percent33 }></circle> <!-- bottom left -->
    <circle r={ radius } cx={ center - percent16 } cy={ center + percent33 }></circle> <!-- bottom right -->
</svg>
