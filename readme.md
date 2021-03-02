# Mendota Buoy Data #

## Goals ##

1. Display Mendota Buoy wind speed and direction in phone browser
2. Avoid using JavaScript libraries
3. No JavaScript frameworks
4. Develop with only "modern" browsers in mind

## Active Issues ##

1. Rework CSS
   1. remove inline style attributes
   2. develop coherent layouts
   3. use :root
   4. use variables
   5. bonus: redo HTML data table to CSS table
2. Remove various log statements
3. Remove unused properties on the ChartElement class

## Developer Wish List ##

1. Add second wind direction indicator mode in which:
   1. the user select a point along the timeline
      1. point with mouse?
      2. select from list of times?
   2. the wind direction at the selected time becomes the point of reference
      1. in essence "head to wind"
      2. true north on the chart
   3. the display shows a color gradient
      1. darker as the wind veers further from head-to-wind
      2. red - left - to port
      3. green - right - to starboard
      4. white - head to wind
2. Allow users to set the range for range averages
3. Allow for deeper history with scrollable chart
