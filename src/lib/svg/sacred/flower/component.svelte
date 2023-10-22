<script lang="ts">
  const dimensions = 609
  const diameter = 120
  const xPadding = 52
  const xConstant = 37

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
  export let genesis = false
  export let strokeWidth = 5.4
  export let metatronsCube = false
  export let color = 'rgb(234, 198, 3)'
  export let flowerSurroundingCircle = false
  export let genesisSurroundingCircle = false

  $: radius = diameter / 2
  $: center = dimensions / 2
  $: viewBox = genesis ? '177 177 260 260' : `0 0 ${ dimensions } ${ dimensions }`

  $: yFirstOptions = [
    center - (diameter * 2),
    center - (diameter * 1.75),
    center - (diameter * 1.5),
    center - diameter - (radius / 2),
    center - diameter,
  ]

  $: if (yFirstOptions) setColumns()

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
    } else if (genesis) {
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


<svg xmlns="http://www.w3.org/2000/svg" class="logo__flower-of-life" { viewBox } height={ dimensions } width={ dimensions }>
  <g fill="none" stroke-width="{ strokeWidth }px" stroke={ color }>


    { #each columns as column }
      { #each { length: column.count } as _, index }
        { #if flower || (column.visibleCircles && column.visibleCircles.includes(index)) }
          <circle r={ radius } cx={ column.x } cy={ getY(index, column.yFirst) }></circle>
        { /if }
      { /each }
    {/each }


    { #if flowerSurroundingCircle }
      <circle r="300" cx={ center } cy={ center }></circle> <!-- surrounding circle -->
    { /if }


    { #if genesisSurroundingCircle }
      <circle r="120" cx={ center } cy={ center }></circle> <!-- surrounding circle -->
    { /if }


    { #if merkaba || metatronsCube }
      <!-- top center: starting point -->
      <circle r="2" cx="306" cy="66.7" fill={ color }></circle> <!-- center circle -->
      <line x1="306" y1="63.5" x2="306" y2="544.5"></line> <!-- top > bottom -->
      <line x1="306" y1="64.5" x2="98" y2="424.5"></line> <!-- top > bottom left -->
      <line x1="306" y1="64.5" x2="514" y2="424.5"></line> <!-- top > bottom right -->
      { #if metatronsCube }
        <line x1="306" y1="64.5" x2="98" y2="184.5"></line> <!-- top > top left -->
        <line x1="306" y1="64.5" x2="514" y2="184.5"></line> <!-- top > top right -->
      { /if }


      <!-- top left: starting point -->
      <circle r="2" cx="100" cy="185.4" fill={ color }></circle> <!-- center circle -->
      <line x1="98" y1="184.5" x2="306" y2="544.5"></line> <!-- top left > bottom -->
      <line x1="98" y1="184.5" x2="514" y2="424.5"></line> <!-- top left > bottom right -->
      <line x1="98" y1="184.5" x2="514" y2="184.5"></line> <!-- top left > top right -->
      { #if metatronsCube }
        <line x1="98" y1="184.5" x2="98" y2="424.5"></line> <!-- top left > bottom left -->
      { /if }


      <!-- top right: starting point -->
      <circle r="2" cx="512" cy="185.5" fill={ color }></circle> <!-- center circle -->
      <line x1="514" y1="184.5" x2="98" y2="424.5"></line> <!-- top right > bottom left -->
      <line x1="514" y1="184.5" x2="306" y2="544.5"></line> <!-- top right > bottom -->
      { #if metatronsCube }
        <line x1="514" y1="184.5" x2="514" y2="424.5"></line> <!-- top right > bottom right -->
      { /if }


      <!-- bottom left: starting point -->
      <circle r="2" cx="100" cy="423.5" fill={ color }></circle> <!-- center circle -->
      <line x1="98" y1="424.5" x2="514" y2="424.5"></line> <!-- bottom left > bottom right -->
      { #if metatronsCube }
        <line x1="98" y1="424.5" x2="306" y2="544.5"></line> <!-- bottom left > bottom -->
      { /if }


      <!-- bottom right: starting point -->
      <circle r="2" cx="512" cy="423.5" fill={ color }></circle> <!-- center circle -->
      { #if metatronsCube }
        <line x1="514" y1="424.5" x2="306" y2="544.5"></line> <!-- bottom right > bottom -->
      { /if }


      <!-- bottom: starting point -->
      <circle r="2" cx="306" cy="542.3" fill={ color }></circle> <!-- center circle -->


      <!-- inner top center: starting point -->
      <line x1="306" y1="184.5" x2="410" y2="364.5"></line> <!-- inner top > inner bottom right -->
      <line x1="306" y1="184.5" x2="202" y2="364.5"></line> <!-- inner top > inner bottom left -->
      { #if metatronsCube }
        <line x1="306" y1="184.5" x2="202" y2="244.5"></line> <!-- inner top > inner top left -->
        <line x1="306" y1="184.5" x2="410" y2="244.5"></line> <!-- inner top > inner top right -->
      { /if }


      <!-- inner top left: starting point -->
      <line x1="202" y1="244.5" x2="410" y2="244.5"></line> <!-- inner top left > inner top right -->
      <line x1="202" y1="244.5" x2="306" y2="424.5"></line> <!-- inner top left > inner bottom -->
      { #if metatronsCube }
        <line x1="202" y1="244.5" x2="202" y2="364.5"></line> <!-- inner top left > inner bottom left -->
      { /if }


      <!-- inner top right: starting point -->
      <line x1="410" y1="244.5" x2="306" y2="424.5"></line> <!-- inner top right > inner bottom -->
      { #if metatronsCube }
        <line x1="410" y1="244.5" x2="410" y2="364.5"></line> <!-- inner top right > inner bottom right -->
      { /if }


      <!-- inner bottom left: starting point -->
      <line x1="202" y1="364.5" x2="410" y2="364.5"></line> <!-- inner bottom left > inner bottom right -->
      { #if metatronsCube }
        <line x1="202" y1="364.5" x2="306" y2="424.5"></line> <!-- inner bottom left > inner bottom -->
      { /if }


      <!-- inner bottom right: starting point -->
      { #if metatronsCube }
        <line x1="410" y1="364.5" x2="306" y2="424.5"></line> <!-- inner bottom right > inner bottom -->
      { /if }
    { /if }
  </g>
</svg>
