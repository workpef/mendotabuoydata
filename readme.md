# Mendota Buoy Data #

Sailing and racing Lasers on Lake Mendota, I had been looking for a statisfactory presentation of the wind data collected from a [buoy](https://metobs.ssec.wisc.edu/mendota/buoy/) located off [Picnic Point](https://www.google.com/maps/place/43%C2%B005'58.2%22N+89%C2%B024'16.2%22W/@43.0996009,-89.4206768,14z/data=!4m5!3m4!1s0x0:0x0!8m2!3d43.0995!4d-89.4045).&emsp; I could not find one, hence this project.

## Goals ##

1. Display Mendota Buoy wind speed and direction in phone browser
2. No JavaScript libraries
3. No JavaScript frameworks
4. Single static page
5. Develop with only "modern" browsers in mind

## Data Source ##

&emsp;&emsp;University of Wisconsin-Madison Space Science and Engineering Center - ( [SSEC](https://www.ssec.wisc.edu/) )

&emsp;&emsp;[API Documentation](https://metobs-test.ssec.wisc.edu/api/data)

## Active Issues ##

1. Rework CSS
   1. remove inline style attributes
   2. develop coherent layouts
   3. use :root
   4. use variables
   5. bonus: redo HTML data table to CSS table
2. Remove
   1. various log statements
   2. unused properties on the ChartElement class
3. Resolve/understand
   1. async-await with the promise ("fetch")
   2. the apparent day boundary issue with the hour 19:00-19:59
4. Correct data table load when data is incomplete

## Developer Wish List ##

1. Add second wind direction indicator mode in which:
   1. the user selects a point along the timeline
      1. point with mouse?
      2. select from list of times?
   2. the wind direction at the selected time becomes the point of reference
      1. in essence "head to wind"
      2. true north on the chart
   3. the display shows a color gradient spanning the chart
      1. darker as the wind veers further from head-to-wind
      2. red - left - to port
      3. green - right - to starboard
      4. white - head to wind
2. Allow users to set the range for range averages
3. Allow for deeper history with scrollable chart
