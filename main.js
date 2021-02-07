
/**
 *  
 */








/** Class used to capture  returned data and ploting loctions
 * 
 *     speed
 */
class WindRec {
    /**  @member {number}  - wind speed at the buoy  "mendota.buoy.wind_speed" */
    speed;
    /**  @member {number} */
    gust;
    /**  @member {number} */
    direction;
    time;
    /**  @member {string} */
    speedLocationX;
    /**  @member {number} */
    speedLocationY;
    /**  @member {number} */
    speedAvgLocationY;
    /**  @member {number} */
    gustLocationY;
    /**  @member {number} */
    gustAvgLocationY;
    /**  @member {number} */
    windDirectionEndPointX;
    /**  @member {number} */
    windDirectionEndPointY;
    /**  @member {number} */
    movingAverage;
    /**  @member {number} */
    calcWindMovingAverage;
    /**  @member {number} */
    calcGustMovingAverage;
    /**  @member {number} */
    airTemprature;
    waterTemprature;
    pressure;
    calcWindMovingAverageLocaionY;
    last10windSpeed;
    last10gustSpeed;
    last10windSpeedLocationY;
    last10gustSpeedLocationY;
};

const PlotContolIds = [
    ['windSpeedToggle', 'windSpeedColor', 'windSpeedShape', 'speedLocationY'],
    ['windSpeedSsecAvgToggle', 'windSpeedSsecAvgColor', 'windSpeedSsecAvgShape', 'speedAvgLocationY'],
    ['windSpeedLast10AvgToggle', 'windSpeedLast10AvgColor', 'windSpeedLast10AvgShape', 'last10windSpeedLocationY'],
    ['windSpeedAccumAvgToggle', 'windSpeedAccumAvgColor', 'windSpeedAccumAvgShape', 'calcWindMovingAverageLocaionY'],
    ['gustToggle', 'gustColor', 'gustShape', 'gustLocationY'],
    ['gustLast10Toggle', 'gustLast10Color', 'gustLast10Shape', 'last10gustSpeedLocationY'],
    ['windArrowToggle', 'windArrowColor', 'windArrowLocation'],
    ['airTempToggle', 'airTempColor', '', ''],
    ['waterTempToggle', 'waterTempColor', '', ''],
    ['barometricToggle', 'barometricColor', '', '']

];

const PlotControlConstants = {
    wind_speed: 0,
    wind_speed_ssec_avg: 1,
    wind_speed_last_10_avg: 2,
    wind_speed_accum_avg: 3,
    gust: 4,
    gust_last_10: 5,
    wind_arrow: 6,
    air_temp: 7,
    water_temp: 8,
    barometric: 9,

    array_toggle: 0,
    array_color: 1,
    array_shape: 2,
    array_location: 2,
    array_y_axis_name: 3
};

const urlSite = 'http://metobs.ssec.wisc.edu/api/data.json?';
const urlSymbols =
    'symbols=' +
    'mendota.buoy.wind_speed:' +
    'mendota.buoy.gust:' +
    'mendota.buoy.run_wind_speed:' +
    'mendota.buoy.wind_direction:' +
    'mendota.buoy.air_temp:' +
    'mendota.buoy.water_temp_2:' +
    'aoss.tower.pressure';

const UrlSymbolsConstants = {
    mendota_buoy_wind_speed: 0,
    mendota_buoy_gust: 1,
    mendota_buoy_run_wind_speed: 2,
    mendota_buoy_wind_direction: 3,
    mendota_buoy_air_temp: 4,
    mendota_buoy_water_temp_2: 5,
    aoss_tower_pressure: 6,
    plot_time: 7
};

const MS_TO_KNOTS_CONVERSION = 1.944;
const DEGREE_SYMBOL = '\u00B0';
const FORMAT_FOR_TIME = 'en-GB';
const WIND_PLOT_MULTIPLIER = 20;


//#region utility functions

/* The function used to "reduce" array elements.
   See createWindPlots()
===================================================*/
const reduceLastTen = (accumulator, currentValue) => accumulator + currentValue;

/* Establish the request start date/time
============================================================*/
function setWindHistDepth(date, minutes) {
    return new Date(date.getTime() + (minutes * 60000));
};

/* Assemble the request URL according to SSEC/AOSS 
   UW-Madison requirements see https://metobs-test.ssec.wisc.edu/api/data
===============================================================================*/
function generateURL(site, symbols, lowerDate, upperDate) {
    return site + symbols + '&begin=' + formatDateForURL(lowerDate) + '&end=' + formatDateForURL(upperDate);
}

/* Format the the date for the request
=====================================================*/
function formatDateForURL(date) {
    return date.toISOString().substring(0, 10) + 'T' + date.toLocaleTimeString(FORMAT_FOR_TIME);
}

/* Updates slider display 
==============================================================*/
function showWindHist(hist) {
    document.querySelector('#windhistdisplay').value = hist;
}
/* Generates random number
====================================================================*/
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/* Removes unnecessary characters
====================================================*/
function parseDate(ds) {
    return new Date(ds.replace('T', ' ').replace('Z', ''));
}
//#endregion 


let infoIsHidden = true;
function toggleInfo() {
    document.getElementById('infoBandDiv').style.zIndex = infoIsHidden ? 10 : -10;
    infoIsHidden = !infoIsHidden;
}

let dataTableIsHidden = true;
function toggleDataTable() {
    document.getElementById('dataDiv').style.zIndex = dataTableIsHidden ? 20 : -20;
    dataTableIsHidden = !dataTableIsHidden;
}

function reloadData() {

    let depth = document.querySelector('#windhistdisplay').value;
    let userDate = document.getElementById("histDate").value;
    let userTime = document.getElementById("histTime").value;
    let endDate = new Date(new Date(userDate + ' ' + userTime).toUTCString());
    let uppderBnd = new Date(endDate.toUTCString());
    let lowerBnd = setWindHistDepth(uppderBnd, - Number(depth));
    let weaUrl = generateURL(urlSite, urlSymbols, lowerBnd, uppderBnd);

    console.log(weaUrl);

    fetch(weaUrl)
        .then(response => response.json())
        .then((x) => {
            res = x.results;
            ssecData = res.data;
            sym = res.symbols;
            ts = res.timestamps;
            let weatherSourceData = [];

            for (let i = 0; i < ssecData.length; i++) {

                let windSpeed = Number(Number.parseFloat(ssecData[i][UrlSymbolsConstants.mendota_buoy_wind_speed] * MS_TO_KNOTS_CONVERSION).toFixed(1));
                let avgWindSpeed = Number(Number.parseFloat(ssecData[i][UrlSymbolsConstants.mendota_buoy_run_wind_speed] * MS_TO_KNOTS_CONVERSION).toFixed(1));
                let gustSpeed = Number(Number.parseFloat(ssecData[i][UrlSymbolsConstants.mendota_buoy_gust] * MS_TO_KNOTS_CONVERSION).toFixed(1));
                let plotDate = parseDate(ts[i]);
                let plotTime = plotDate.toTimeString(FORMAT_FOR_TIME).substring(0, 5)
                let windDirection = String(ssecData[i][UrlSymbolsConstants.mendota_buoy_wind_direction]).padStart(3, '0');
                let airTemprature = Number.parseFloat(ssecData[i][UrlSymbolsConstants.mendota_buoy_air_temp] * (9 / 5) + 32).toFixed(1);
                let waterTemprature = Number.parseFloat(ssecData[i][UrlSymbolsConstants.mendota_buoy_water_temp_2] * (9 / 5) + 32).toFixed(1);
                let pressure = Number.parseFloat(ssecData[i][UrlSymbolsConstants.aoss_tower_pressure]).toFixed(1);

                weatherSourceData.push([
                    windSpeed,
                    gustSpeed,
                    avgWindSpeed,
                    windDirection,
                    airTemprature,
                    waterTemprature,
                    pressure,
                    plotTime
                ]);
            };
            plot(weatherSourceData);
        });
}


/**
 * @function collectPlotDisplayParameters -
 *  Generates a collection containing the user's measure selections (see
 *   table "userSelections").  Currently only wind measures. 
 *
 * @param {array} controls - and array
 * @return {array} - an array  containing the objects: { checked: isChecked, color: color, shapeIdx: selectedIndex }
 *
 * @example  let controlValues = collectPlotDisplayParameters(controls);
 */
/*
===========================================================================*/
function collectPlotDisplayParameters(controls) {
    let controlParams = [];
    for (let i = PlotControlConstants.wind_speed; i <= PlotControlConstants.barometric; i++) {
        let isChecked = document.getElementById(controls[i][PlotControlConstants.array_toggle]).checked;
        let color = document.getElementById(controls[i][PlotControlConstants.array_color]).value;
        let selectedIndex = 0;
        if (controls[i][PlotControlConstants.array_shape] !== '')
            selectedIndex = document.getElementById(controls[i][PlotControlConstants.array_shape]).selectedIndex;
        controlParams.push({ checked: isChecked, color: color, shapeIdx: selectedIndex });
    }
    return controlParams;
}


function plot(weatherData) {

    const PLOT_CROSS = 0;
    const PLOT_LINE = 1;
    const PLOT_BOX = 2;
    const WIND_PLOT_OFFSET = 40;

    let plotArea = GetCanvasInfo('windPlots', weatherData.length,WIND_PLOT_OFFSET);
    let infoArea = GetCanvasInfo('infoBand', weatherData.length,WIND_PLOT_OFFSET);
    let windPlots = createWindPlots(weatherData, plotArea);
    let aggregates = generateWeatherAggregates(windPlots);
    generateWindGrid(plotArea);
    let controls = collectPlotDisplayParameters(PlotContolIds);

    for (let i = PlotControlConstants.wind_speed; i <= PlotControlConstants.gust_last_10; i++) {
        if (controls[i].checked === true) {
            let shapeIdx = controls[i].shapeIdx;
            let axisName = PlotContolIds[i][PlotControlConstants.array_y_axis_name];
            let color = controls[i].color;
            let startIndex = (axisName.includes('last10') ? 9 : 0);

            if (shapeIdx === PLOT_CROSS) {
                plotCross(windPlots, plotArea, 'speedLocationX', axisName, color, 7, startIndex);
            };
            if (shapeIdx === PLOT_LINE) {
                plotLine(windPlots, plotArea, 'speedLocationX', axisName, color, startIndex);
            };
            if (shapeIdx === PLOT_BOX) {
                plotPoint(windPlots, plotArea, 'speedLocationX', axisName, color, 3, startIndex);
            };
        };
    };
    generateWindDirectionArrows(windPlots, plotArea);
    generateDataTable('dataDisplay', windPlots);
    generateTextMeasures(windPlots, infoArea, controls);
    plotTime(windPlots, plotArea, 10, 1, 'darkblue');
}

function generateWindDirectionArrows(windPlots, plotArea) {
    windPlots.forEach(wp => {
        drawWindDir(wp.direction, wp.speedLocationX, plotArea.chartTop + 30, 'mediumvioletred', plotArea);
    });
};

function generateTextMeasures(windPlots, plotArea, controls) {

    let waterTemp = 0;
    let airTemp = 0;
    let barometricPressure = 0;

    let airTempColor = controls[PlotControlConstants.air_temp].color;
    let pressureColor = controls[PlotControlConstants.barometric].color;
    let waterTempColor = controls[PlotControlConstants.water_temp].color;

    let showAirTemp = controls[PlotControlConstants.air_temp].checked === true;
    let showPressure = controls[PlotControlConstants.barometric].checked === true;
    let showWaterTemp = controls[PlotControlConstants.water_temp].checked === true;

    let yPos = plotArea.height;
    let context = plotArea.context;

    windPlots.forEach(wp => {

        let xPos = wp.speedLocationX;

        if (showWaterTemp && waterTemp !== wp.waterTemprature) {
            plotTextMeasures(wp.waterTemprature.toString(), xPos, yPos - 100, waterTempColor, context);
            waterTemp = wp.waterTemprature;
        };
        if (showAirTemp && wp.airTemprature !== airTemp) {
            plotTextMeasures(wp.airTemprature.toString(), xPos, yPos - 40, airTempColor, context);
            airTemp = wp.airTemprature;
        };
        if (showPressure && wp.pressure !== barometricPressure) {
            plotTextMeasures(wp.pressure.toString(), xPos, 30, pressureColor, context);
            barometricPressure = wp.pressure;
        };
    });


    /* Temporary
    ======================================================================================*/
    context.fillStyle = 'brown';
    context.font = '14px sans-serif';
    context.fillText('Water Temp -----------------------------------------------',50 , yPos - 125);
    context.fillText('Air Temp -------------------------------------------------',50 ,  yPos - 65);
    context.fillText('Pressure -------------------------------------------------',50 ,  60);

    context.font = '22px sans-serif';
    context.fillText('Will contvert to individual charts in the future',100 , 100);

    
};



function plotTextMeasures(textValue, xPos, yPos, color, context) {
    context.translate(xPos, yPos);     // set origin
    context.rotate(-Math.PI / 4);
    context.fillStyle = color;
    context.font = '12px sans-serif';
    context.fillText(textValue, 0, 0);
    context.setTransform(1, 0, 0, 1, 0, 0);
};

function plotTime(windPlots, plotArea, frequency, startIndex, color) {
    let index = 1;
    if (isNaN(startIndex)) startIndex = 1;
    let context = plotArea.context;
    windPlots.forEach(wp => {

        if (index === startIndex || (index > 1 && (index - startIndex) % frequency === 0)) {

            context.translate(wp.speedLocationX, plotArea.chartBottom + 25 );     // set origin
            context.rotate(-Math.PI / 2);
            context.fillStyle = color;
            context.font = '12px sans-serif';
            context.fillText(wp.time, 0, 0);
            context.setTransform(1, 0, 0, 1, 0, 0);
        }

        index += 1;
    });




}



function generateWindGrid(plotArea) {

    let positionX = plotArea.chartLeft;
    let ctx = plotArea.context;

    ctx.fillStyle = 'lavender';
    ctx.fillRect(0, 0, plotArea.width, plotArea.height);

    ctx.lineWidth = 1;
    ctx.setLineDash([1, 8]);
    ctx.strokeStyle = 'black';

    while (positionX < plotArea.chartRight) {
        ctx.beginPath();
        ctx.moveTo(positionX, plotArea.chartTop);
        ctx.lineTo(positionX, plotArea.chartBottom);
        ctx.stroke();
        positionX = positionX + plotArea.plotSpan;
    };
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 6]);
    ctx.strokeStyle = 'red';
    ctx.font = '12px serif';
    for (let i = 5; i < 31; i += 5) {
        let yPos = i * WIND_PLOT_MULTIPLIER;
        let knots = i.toString(); //+ " Knots";
        ctx.setLineDash([1, 6]);
        ctx.beginPath();
        ctx.moveTo(plotArea.chartLeft, plotArea.chartBottom - yPos);
        ctx.lineTo(plotArea.chartRight, plotArea.chartBottom - yPos);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeText(knots, plotArea.chartRight + 5, plotArea.chartBottom - yPos +3);
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = 'black';
};

function plotTempsGrid(windPlots, plotArea,aggregates) {
    let positionX = plotArea.chartLeft;
    let ctx = plotArea.context;

    ctx.fillStyle = "#e5ce8f;";
    ctx.fillRect(0, 0, plotArea.width, plotArea.height);
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 8]);
    ctx.strokeStyle = 'black';

    while (positionX < plotArea.chartRight) {
        ctx.beginPath();
        ctx.moveTo(positionX, plotArea.chartTop);
        ctx.lineTo(positionX, plotArea.chartBottom);
        ctx.stroke();
        positionX = positionX + plotArea.plotSpan;
    };
  
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 6]);
    ctx.strokeStyle = 'red';  
    
    let min = aggregates.pressure.min;
    let max = aggregates.pressure.max;
    let vertSpan = Math.round(aggregates.pressure.max - aggregates.pressure.min ) + 1;

    for(let i = 0; i <= vertSpan; i++){

        ctx.beginPath();
        ctx.moveTo(plotArea.chartLeft, );
        ctx.lineTo(plotArea.chartRight, plotArea.chartBottom - yPos);

    }
    




    



}

function GetCanvasInfo(canvasId, numberOfWindPlots,offset) {
  
    let canvasInstance = document.getElementById(canvasId);
    let ctx = canvasInstance.getContext("2d");
    let cWidth = canvasInstance.width;
    let cHeight = canvasInstance.height;

    let top = offset;
    let left = offset;
    let bottom = canvasInstance.height - (offset + 40);
    let right = canvasInstance.width - offset;
    let plotWidth = (cWidth - (2 * offset)) / numberOfWindPlots;



    return {
        canvas: canvasInstance,
        context: ctx,
        width: cWidth,
        height: cHeight,
        chartTop: top,
        chartLeft: left,
        chartBottom: bottom,
        chartRight: right,
        plotSpan: plotWidth
    };
}
function showAlert(pos) {
    alert('X position: ' + pos);
}

function createWindPlots(WeatherData, plotArea) {
    let windPlots = [];
    let windAccum = 0;
    let gustAccum = 0;
    let windLast10 = [];
    let gustLast10 = [];

    for (let i = 0; i < WeatherData.length; i++) {

        let wp = Object.create(WindRec);

        wp.speed = WeatherData[i][UrlSymbolsConstants.mendota_buoy_wind_speed];
        windAccum += wp.speed;
        wp.calcWindMovingAverage = Number(windAccum / (i + 1)).toFixed(1);
        wp.movingAverage = WeatherData[i][UrlSymbolsConstants.mendota_buoy_run_wind_speed];
        windLast10.push(wp.speed);

        wp.gust = WeatherData[i][UrlSymbolsConstants.mendota_buoy_gust];

        gustAccum += wp.gust;
        gustLast10.push(wp.gust);
        wp.calcGustMovingAverage = Number(gustAccum / (i + 1)).toFixed(1);

        wp.direction = WeatherData[i][UrlSymbolsConstants.mendota_buoy_wind_direction];
        wp.airTemprature = WeatherData[i][UrlSymbolsConstants.mendota_buoy_air_temp];
        wp.waterTemprature = WeatherData[i][UrlSymbolsConstants.mendota_buoy_water_temp_2];
        wp.pressure = WeatherData[i][UrlSymbolsConstants.aoss_tower_pressure];
        wp.time = WeatherData[i][UrlSymbolsConstants.plot_time];

        wp.speedLocationX = (plotArea.plotSpan * i) + plotArea.chartLeft;
        wp.speedLocationY = plotArea.chartBottom - (WIND_PLOT_MULTIPLIER * wp.speed);
        wp.gustLocationY = plotArea.chartBottom - (WIND_PLOT_MULTIPLIER * wp.gust);
        wp.speedAvgLocationY = plotArea.chartBottom - (WIND_PLOT_MULTIPLIER * wp.movingAverage);
        wp.gustAvgLocationY = plotArea.chartBottom - (WIND_PLOT_MULTIPLIER * wp.calcGustMovingAverage);

        wp.calcWindMovingAverageLocaionY = plotArea.chartBottom - (WIND_PLOT_MULTIPLIER * wp.calcWindMovingAverage);



        if (i > 8) {

            let ltw = windLast10.slice(i - 9, i).reduce(reduceLastTen);
            let ltg = gustLast10.slice(i - 9, i).reduce(reduceLastTen);

            wp.last10windSpeed = Number(ltw / 10).toFixed(1)
            wp.last10gustSpeed = Number(ltg / 10).toFixed(1)
            wp.last10windSpeedLocationY = plotArea.chartBottom - (WIND_PLOT_MULTIPLIER * wp.last10windSpeed);
            wp.last10gustSpeedLocationY = plotArea.chartBottom - (WIND_PLOT_MULTIPLIER * wp.last10gustSpeed);
        }
        windPlots.push(wp);
    }
    return windPlots;
}

function generateWeatherAggregates(windPlots) {
    let aggregates =
    {
        airTemprature: { min: 10000, max: 0, spread: 0 },
        waterTemprature: { min: 10000, max: 0, spread: 0 },
        pressure: { min: 10000, max: 0, spread: 0 }
    };
    windPlots.forEach(wp => {
        aggregates.airTemprature.min = Math.min(aggregates.airTemprature.min, Number(wp.airTemprature));
        aggregates.airTemprature.max = Math.max(aggregates.airTemprature.max, Number(wp.airTemprature));
        aggregates.airTemprature.spread = Math.ceil(aggregates.waterTemprature.max - aggregates.waterTemprature.min);

        aggregates.waterTemprature.min = Math.min(aggregates.waterTemprature.min, Number(wp.waterTemprature));
        aggregates.waterTemprature.max = Math.max(aggregates.waterTemprature.max, Number(wp.waterTemprature));
        aggregates.waterTemprature.spread = Math.ceil(aggregates.waterTemprature.max - aggregates.waterTemprature.min);

        aggregates.pressure.min = Math.min(aggregates.pressure.min, Number(wp.pressure));
        aggregates.pressure.max = Math.max(aggregates.pressure.max, Number(wp.pressure));
        aggregates.pressure.spread = Math.ceil(aggregates.waterTemprature.max - aggregates.waterTemprature.min);
    });

    return aggregates;
}


function plotPoint(windPlots, plotArea, posX, posY, fillColor, lineOffset, startIndex) {
    let corner = lineOffset * 2;
    let ctx = plotArea.context;
    let initialIndex = 0;
    if (!Number.isNaN(startIndex)) { initialIndex = startIndex; };
    for (let i = initialIndex; i < windPlots.length; i++) {
        let wp = windPlots[i];
        ctx.fillStyle = fillColor;
        ctx.fillRect(wp[posX] - lineOffset, wp[posY] - lineOffset, corner, corner);
    };
}

function plotLine(windPlots, plotArea, posX, posY, lineColor, startIndex) {
    let ctx = plotArea.context;
    let lastElement = windPlots.length - 1;
    let initialIndex = 0;
    if (!Number.isNaN(startIndex)) { initialIndex = startIndex; };
    for (let i = initialIndex; i < windPlots.length; i++) {
        let wp = windPlots[i];
        if (i < lastElement) {
            let nextWp = windPlots[i + 1];
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.moveTo(wp[posX], wp[posY]);
            ctx.lineTo(nextWp[posX], nextWp[posY]);
            ctx.stroke();
        };
    };
};

function plotCross(windPlots, plotArea, posX, posY, lineColor, lineLength, startIndex) {
    let ctx = plotArea.context;
    let segment = lineLength / 2;
    let initialIndex = 0;
    if (!Number.isNaN(startIndex)) { initialIndex = startIndex; };
    for (let i = initialIndex; i < windPlots.length; i++) {
        let wp = windPlots[i];
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.moveTo(wp[posX], wp[posY] - segment);
        ctx.lineTo(wp[posX], wp[posY] + segment);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.moveTo(wp[posX] - segment, wp[posY]);
        ctx.lineTo(wp[posX] + segment, wp[posY]);
        ctx.stroke();
    };

}

function generateDataTable(elementId, windPlots) {
    let docRef = document.getElementById(elementId);
    let entryNo = 0;

    while (docRef.rows.length > 1) {
        docRef.deleteRow(1);
    }

    windPlots.forEach(wp => {

        entryNo += 1;
        let nr = docRef.insertRow(-1);

        let pressureCell = nr.insertCell(0);
        let pressure = document.createTextNode(wp.pressure);
        pressureCell.appendChild(pressure);

        let waterTempratureCell = nr.insertCell(0);
        let waterTemprature = document.createTextNode(wp.waterTemprature);
        waterTempratureCell.appendChild(waterTemprature)

        let airTempratureCell = nr.insertCell(0);
        let airTemprature = document.createTextNode(wp.airTemprature);
        airTempratureCell.appendChild(airTemprature)


        let calcGustMovingAverageCell = nr.insertCell(0);
        let calcGustMovingAverage = document.createTextNode(wp.calcGustMovingAverage);
        calcGustMovingAverageCell.appendChild(calcGustMovingAverage);

        let gustCell = nr.insertCell(0);
        let gust = document.createTextNode(wp.gust);
        gustCell.appendChild(gust);

        let calcWindMovingAverageCell = nr.insertCell(0);
        let calcWindMovingAverage = document.createTextNode(wp.calcWindMovingAverage);
        calcWindMovingAverageCell.appendChild(calcWindMovingAverage);

        let movingAverageCell = nr.insertCell(0);
        let movingAverage = document.createTextNode(wp.movingAverage);
        movingAverageCell.appendChild(movingAverage);

        let windSpeedCell = nr.insertCell(0);
        let windSpeedValue = document.createTextNode(wp.speed);
        windSpeedCell.appendChild(windSpeedValue);

        let windDirCell = nr.insertCell(0);
        let windDirValue = document.createTextNode(wp.direction + DEGREE_SYMBOL);
        windDirCell.appendChild(windDirValue);

        let tempCell = nr.insertCell(0);
        let tempValue = document.createTextNode(wp.time);
        tempCell.appendChild(tempValue);

        let rowno = nr.insertCell(0);
        let rowValue = document.createTextNode(entryNo);
        rowno.appendChild(rowValue);

    });
};



function drawWindDir(windDirection, newOriginXaxis, newOriginYAxis, arrowColor, plotArea) {

    //  let canvas = document.getElementById(canvasId);
    let ctx = plotArea.context;
    let lineLength = 25;
    let arrowOffset = 5;

    ctx.strokeStyle = arrowColor;
    ctx.lineWidth = 2;



    /* Draw Arrow 
       Conceptually we are drawing a horizontal arrow
       so subtract 90 degrees from the wind direction
       and then "rotate"
 
    //ctx.fillText(windDirection, 10,-3);
    ---------------------------------------------------*/
    ctx.translate(newOriginXaxis, newOriginYAxis);     // set origin
    ctx.rotate((windDirection - 90) * Math.PI / 180);  // rotate axis

    ctx.beginPath();
    //Draw line
    ctx.moveTo(0, 0);
    ctx.lineTo(lineLength, 0);
    //draw arrow barbs from line end point
    ctx.moveTo(lineLength, 0);
    ctx.lineTo(lineLength - arrowOffset, - arrowOffset);
    ctx.moveTo(lineLength, 0);
    ctx.lineTo(lineLength - arrowOffset, arrowOffset);
    ctx.stroke();

    // restore canvas origin
    ctx.setTransform(1, 0, 0, 1, 0, 0);

}

