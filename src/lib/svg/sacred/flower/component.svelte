<script lang="ts">
  const width = 272
  const height = 305
  const xPadding = 26
  const xConstant = 19

  export let fruit = false
  export let flower = false
  export let merkaba = false
  export let strokeWidth = 3.6
  export let metatronsCube = false
  export let color = 'rgb(234, 198, 3)'

  $: radius = diameter / 2
  $: center = height / 2
  $: diameter = 60
  $: viewBox = flower || fruit ? `17 -1 ${ width } ${ height }` : `58 30 192 245`

  $: yFirstOptions = [
    center - (diameter * 2),
    center - (diameter * 1.75),
    center - (diameter * 1.5),
    center - diameter - (radius / 2),
    center - diameter,
  ]

  $: hideIfFruitOptions = [
    [ 1, 2, 3 ],
    [ 0, 1, 2, 3, 4, 5 ],
    [ 0, 1, 3, 5, 6 ],
    [ 0, 1, 2, 3, 4, 5, 6, 7 ],
    [ 1, 3, 5, 7 ]
  ]

  $: columns = [
    { count: 5,  yFirst: yFirstOptions[4],  hideIfFruit: hideIfFruitOptions[0],  x: radius + xConstant },
    { count: 6,  yFirst: yFirstOptions[3],  hideIfFruit: hideIfFruitOptions[1],  x: radius + xConstant + xPadding },
    { count: 7,  yFirst: yFirstOptions[2],  hideIfFruit: hideIfFruitOptions[2],  x: radius + xConstant + (xPadding * 2) },
    { count: 8,  yFirst: yFirstOptions[1],  hideIfFruit: hideIfFruitOptions[3],  x: radius + xConstant + (xPadding * 3) },
    { count: 9,  yFirst: yFirstOptions[0],  hideIfFruit: hideIfFruitOptions[4],  x: radius + xConstant + (xPadding * 4) },
    { count: 8,  yFirst: yFirstOptions[1],  hideIfFruit: hideIfFruitOptions[3],  x: radius + xConstant + (xPadding * 5) },
    { count: 7,  yFirst: yFirstOptions[2],  hideIfFruit: hideIfFruitOptions[2],  x: radius + xConstant + (xPadding * 6) },
    { count: 6,  yFirst: yFirstOptions[3],  hideIfFruit: hideIfFruitOptions[1],  x: radius + xConstant + (xPadding * 7) },
    { count: 5,  yFirst: yFirstOptions[4],  hideIfFruit: hideIfFruitOptions[0],  x: radius + xConstant + (xPadding * 8) },
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


<svg xmlns="http://www.w3.org/2000/svg" class="logo__flower-of-life" { viewBox } width={ width * 3 }  height={ height * 3 }>
  <g fill="none" stroke-width="{ strokeWidth }px" stroke={ color }>


    { #each columns as column }
      { #each { length: column.count } as _, index }
        { #if flower || (fruit && !column.hideIfFruit.includes(index)) }
          <circle r={ radius } cx={ column.x } cy={ getY(index, column.yFirst) }></circle>
        { /if }
      { /each }
     {/each }


    { #if merkaba || metatronsCube }
      <!-- top center: starting point -->
      <circle r="0.9" cx="153" cy="33.4" fill={ color }></circle> <!-- center circle -->
      <line x1="153" y1="31.5" x2="153" y2="273.5"></line> <!-- top > bottom -->
      <line x1="153" y1="32.5" x2="49" y2="212.5"></line> <!-- top > bottom left -->
      <line x1="153" y1="32.5" x2="257" y2="212.5"></line> <!-- top > bottom right -->
      { #if metatronsCube }
        <line x1="153" y1="32.5" x2="49" y2="92.5"></line> <!-- top > top left -->
        <line x1="153" y1="32.5" x2="257" y2="92.5"></line> <!-- top > top right -->
      { /if }


      <!-- top left: starting point -->
      <circle r="0.9" cx="50" cy="93" fill={ color }></circle> <!-- center circle -->
      <line x1="49" y1="92.5" x2="153" y2="272.5"></line> <!-- top left > bottom -->
      <line x1="49" y1="92.5" x2="257" y2="212.5"></line> <!-- top left > bottom right -->
      <line x1="49" y1="92.5" x2="257" y2="92.5"></line> <!-- top left > top right -->
      { #if metatronsCube }
        <line x1="49" y1="92.5" x2="49" y2="212.5"></line> <!-- top left > bottom left -->
      { /if }


      <!-- top right: starting point -->
      <circle r="0.9" cx="256.2" cy="93" fill={ color }></circle> <!-- center circle -->
      <line x1="257" y1="92" x2="49" y2="212.5"></line> <!-- top right > bottom left -->
      <line x1="257" y1="92" x2="153" y2="272.5"></line> <!-- top right > bottom -->
      { #if metatronsCube }
        <line x1="257" y1="92" x2="257" y2="212.5"></line> <!-- top right > bottom right -->
      { /if }


      <!-- bottom left: starting point -->
      <circle r="0.9" cx="50" cy="212" fill={ color }></circle> <!-- center circle -->
      <line x1="49" y1="212.5" x2="257" y2="212.5"></line> <!-- bottom left > bottom right -->
      { #if metatronsCube }
        <line x1="49" y1="212.5" x2="153" y2="272.5"></line> <!-- bottom left > bottom -->
      { /if }


      <!-- bottom right: starting point -->
      <circle r="0.9" cx="256.2" cy="212" fill={ color }></circle> <!-- center circle -->
      { #if metatronsCube }
        <line x1="256.2" y1="212.5" x2="153" y2="272.5"></line> <!-- bottom left > bottom -->
      { /if }


      <!-- bottom: starting point -->
      <circle r="0.9" cx="153" cy="271.6" fill={ color }></circle> <!-- center circle -->


      <!-- inner top center: starting point -->
      <line x1="153" y1="92.5" x2="205" y2="182.5"></line> <!-- inner top > inner bottom right -->
      <line x1="153" y1="92.5" x2="101" y2="182.5"></line> <!-- inner top > inner bottom left -->
      { #if metatronsCube }
        <line x1="153" y1="92.5" x2="101" y2="122.5"></line> <!-- inner top > inner top left -->
        <line x1="153" y1="92.5" x2="205" y2="122.5"></line> <!-- inner top > inner top right -->
      { /if }


      <!-- inner top left: starting point -->
      <line x1="101" y1="122.5" x2="205" y2="122.5"></line> <!-- inner top left > inner top right -->
      <line x1="101" y1="122.5" x2="153" y2="212.5"></line> <!-- inner top left > inner bottom -->
      { #if metatronsCube }
        <line x1="101" y1="122.5" x2="101" y2="182.5"></line> <!-- inner top left > inner bottom left -->
      { /if }


      <!-- inner top right: starting point -->
      <line x1="205" y1="122.5" x2="153" y2="212.5"></line> <!-- inner top right > inner bottom -->
      { #if metatronsCube }
        <line x1="205" y1="122.5" x2="205" y2="182.5"></line> <!-- inner top right > inner bottom right -->
      { /if }


      <!-- inner bottom left: starting point -->
      <line x1="101" y1="182.5" x2="205" y2="182.5"></line> <!-- inner bottom left > inner bottom right -->
      { #if metatronsCube }
        <line x1="101" y1="182.5" x2="153" y2="212.5"></line> <!-- inner bottom left > inner bottom -->
      { /if }


      <!-- inner bottom right: starting point -->
      { #if metatronsCube }
        <line x1="205" y1="182.5" x2="153" y2="212.5"></line> <!-- inner bottom right > inner bottom -->
      { /if }
    { /if }
  </g>
</svg>
