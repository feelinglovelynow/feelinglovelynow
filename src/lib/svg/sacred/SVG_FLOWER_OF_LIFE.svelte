<script lang="ts">
  const strokeWidth = 2.7
  const height = 305
  const width = 272
  const xConstant = 19
  const xPadding = 26
  const color = 'rgb(234, 198, 3)'

  $: radius = diameter / 2
  $: center = height / 2
  $: diameter = 60

  $: yFirstOptions = [
    center - (diameter * 2),
    center - (diameter * 1.75),
    center - (diameter * 1.5),
    center - diameter - (radius / 2),
    center - diameter,
  ]

  $: columns = [
    { count: 5,  yFirst: yFirstOptions[4],  x: radius + xConstant },
    { count: 6,  yFirst: yFirstOptions[3],  x: radius + xConstant + xPadding },
    { count: 7,  yFirst: yFirstOptions[2],  x: radius + xConstant + (xPadding * 2) },
    { count: 8,  yFirst: yFirstOptions[1],  x: radius + xConstant + (xPadding * 3) },
    { count: 9,  yFirst: yFirstOptions[0],  x: radius + xConstant + (xPadding * 4) },
    { count: 8,  yFirst: yFirstOptions[1],  x: radius + xConstant + (xPadding * 5) },
    { count: 7,  yFirst: yFirstOptions[2],  x: radius + xConstant + (xPadding * 6) },
    { count: 6,  yFirst: yFirstOptions[3],  x: radius + xConstant + (xPadding * 7) },
    { count: 5,  yFirst: yFirstOptions[4],  x: radius + xConstant + (xPadding * 8) },
  ]

  function getY (index: number, yFirst: number) {
    switch (index) {
      case 0: return yFirst
      case 1: return yFirst + radius
      case 2: return yFirst + (radius * 2)
      case 3: return yFirst + (radius * 3)
      case 4: return yFirst + (radius * 4)
      case 5: return yFirst + (radius * 5)
      case 6: return yFirst + (radius * 6)
      case 7: return yFirst + (radius * 7)
      case 8: return yFirst + (radius * 8)
    }
  }
</script>


<svg xmlns="http://www.w3.org/2000/svg" class="logo__flower-of-life" viewBox="17 -1 { width } { height }" width={ width * 3 }  height={ height * 3 }>
  <g fill="none" stroke-width="{ strokeWidth }px" stroke={ color }>
    { #each columns as column }
      { #each { length: column.count } as _, index }
        <circle r={ radius } cx={ column.x } cy={ getY(index, column.yFirst) }></circle>
      { /each }
     {/each }
  </g>
</svg>
