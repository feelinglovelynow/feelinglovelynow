<script lang="ts">
  const width = 272
  const height = 305
  const diameter = 60
  const xPadding = 26
  const xConstant = 19

  let viewBox: string = ''
  let columns: Columns = []

  type Columns = {
    count: number
    yFirst: number
    x: number
    visibleCircles?: number[]
  }[]

  export let fruit = false
  export let flower = false
  export let merkaba = false
  export let strokeWidth = 3.6
  export let metatronsCube = false
  export let color = 'rgb(234, 198, 3)'
  export let circleCount: undefined | number = undefined

  $: radius = diameter / 2
  $: center = height / 2

  $: yFirstOptions = [
    center - (diameter * 2),
    center - (diameter * 1.75),
    center - (diameter * 1.5),
    center - diameter - (radius / 2),
    center - diameter,
  ]

  $: if (yFirstOptions) setColumns()

  if (flower || fruit) viewBox = `17 -1 ${ width } ${ height + 2 }`
  else if (circleCount) viewBox = '114 87 78 131'
  else viewBox = '58 30 192 247'

  function setColumns () {
    columns = [
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

    if (fruit) {
      columns[0].visibleCircles = columns[8].visibleCircles = [ 0, 4 ]
      columns[1].visibleCircles = columns[7].visibleCircles = [ ]
      columns[2].visibleCircles = columns[6].visibleCircles = [ 2, 4 ]
      columns[3].visibleCircles = columns[5].visibleCircles = [ 8 ]
      columns[4].visibleCircles = [ 0, 2, 4, 6, 8 ]
    } else if (circleCount === 1) {
      columns[0].visibleCircles = columns[1].visibleCircles = columns[2].visibleCircles = columns[3].visibleCircles = columns[5].visibleCircles = columns[6].visibleCircles = columns[7].visibleCircles = columns[8].visibleCircles = [ ]
      columns[4].visibleCircles = [ 4 ]
    } else if (circleCount === 2) {
      columns[0].visibleCircles = columns[1].visibleCircles = columns[2].visibleCircles = columns[3].visibleCircles = columns[6].visibleCircles = columns[7].visibleCircles = columns[8].visibleCircles = [ ]
      columns[4].visibleCircles = [ 4 ]
      columns[5].visibleCircles = [ 3 ]
    } else if (circleCount === 3) {
      columns[0].visibleCircles = columns[1].visibleCircles = columns[2].visibleCircles = columns[3].visibleCircles = columns[6].visibleCircles = columns[7].visibleCircles = columns[8].visibleCircles = [ ]
      columns[4].visibleCircles = [ 4 ]
      columns[5].visibleCircles = [ 3, 4 ]
    } else if (circleCount === 4) {
      columns[0].visibleCircles = columns[1].visibleCircles = columns[2].visibleCircles = columns[3].visibleCircles = columns[6].visibleCircles = columns[7].visibleCircles = columns[8].visibleCircles = [ ]
      columns[4].visibleCircles = [ 4, 5 ]
      columns[5].visibleCircles = [ 3, 4 ]
    } else if (circleCount === 4) {
      columns[0].visibleCircles = columns[1].visibleCircles = columns[2].visibleCircles = columns[6].visibleCircles = columns[7].visibleCircles = columns[8].visibleCircles = [ ]
      columns[3].visibleCircles = [ 4 ]
      columns[4].visibleCircles = [ 4, 5 ]
      columns[5].visibleCircles = [ 3, 4 ]
    } else if (circleCount === 5) {
      columns[0].visibleCircles = columns[1].visibleCircles = columns[2].visibleCircles = columns[6].visibleCircles = columns[7].visibleCircles = columns[8].visibleCircles = [ ]
      columns[3].visibleCircles = columns[5].visibleCircles = [ 3, 4 ]
      columns[4].visibleCircles = [ 4, 5 ]
    } else if (circleCount === 6) {
      columns[0].visibleCircles = columns[1].visibleCircles = columns[2].visibleCircles = columns[6].visibleCircles = columns[7].visibleCircles = columns[8].visibleCircles = [ ]
      columns[4].visibleCircles = [ 3, 4, 5 ]
      columns[3].visibleCircles = columns[5].visibleCircles = [ 3, 4 ]
    }
  }

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
        { #if flower || (column.visibleCircles && column.visibleCircles.includes(index)) }
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
