




let depth = '75';

let endDate = new Date(new Date('2020-07-21 15:00:00').toUTCString());
let beginDate = setWindHistDepth(endDate, - Number(depth));



class WindRec {
    speed;
    gust;
    direction;
    time;
    speedLocationX;
    speedLocationY;
    speedAvgLocationY;
    gustLocationY;
    gustAvgLocationY;
    windDirectionEndPointX;
    windDirectionEndPointY;
    movingAverage;
    calcWindMovingAverage;
    calcGustMovingAverage;
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
    ['airTempToggle', 'airTempColor', ''],
    ['waterTempToggle', 'waterTempColor', '']
];

const PlotControlConstants = {
    wind_speed: 0,
    wind_speed_ssec_avg: 1,
    wind_speed_last_10_avg: 2,
    wind_speed_accum_avg: 3,
    gust: 4,
    gust_last_10: 5,
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
const WIND_PLOT_OFFSET = 40;

//#region utility functions

const reduceLastTen = (accumulator, currentValue) => accumulator + currentValue;

function initDateFromControl() {

    let userDate = document.getElementById("histDate").value;
    let userTime = document.getElementById("histTime").value;
    endDate = new Date(new Date(userDate + ' ' + userTime).toUTCString());
    setWindHistDepth(endDate, - Number(depth));
}

function setWindHistDepth(date, minutes) {
    return new Date(date.getTime() + (minutes * 60000));
};

function generateURL(site, symbols, lowerDate, upperDate) {

    return site + symbols + '&begin=' + formatDateForURL(lowerDate) + '&end=' + formatDateForURL(upperDate);
}
function formatDateForURL(date) {
    return date.toISOString().substring(0, 10) + 'T' + date.toLocaleTimeString(FORMAT_FOR_TIME);
}

function showWindHist(hist) {
    document.querySelector('#windhistdisplay').value = hist;
    depth = hist;
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function parseDate(ds) {
    return new Date(ds.replace('T', ' ').replace('Z', ''));
}
//#endregion 

reloadData();


function reloadData() {

    let uppderBnd = new Date(endDate.toUTCString());
    let lowerBnd = setWindHistDepth(uppderBnd, - Number(depth));
    weaUrl = generateURL(urlSite, urlSymbols, lowerBnd, uppderBnd);
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

            showWindHist(depth);
            plot(weatherSourceData);

        });
}




function collectPlotDisplayParameters(controls) {
    let controlParams = [];

    for (let i = PlotControlConstants.wind_speed; i <= PlotControlConstants.gust_last_10; i++) {

        let isChecked = document.getElementById(controls[i][PlotControlConstants.array_toggle]).checked;
        let color = document.getElementById(controls[i][PlotControlConstants.array_color]).value;
        let selectedIndex = document.getElementById(controls[i][PlotControlConstants.array_shape]).selectedIndex;

        controlParams.push({ checked: isChecked, color: color, shapeIdx: selectedIndex });
    }
    return controlParams;
}


function plot(weatherData) {

    const PLOT_CROSS = 0;
    const PLOT_LINE = 1;
    const PLOT_BOX = 2;

    let plotArea = GetCanvasInfo('windPlots', weatherData.length);
    let windPlots = createWindPlots(weatherData, plotArea);
    generateGrid(plotArea);
    let controls = collectPlotDisplayParameters(PlotContolIds);

    for (let i = PlotControlConstants.wind_speed; i <= PlotControlConstants.gust_last_10; i++) {

        if (controls[i].checked === true) {
            let shapeIdx = controls[i].shapeIdx;
            let axisName = PlotContolIds[i][PlotControlConstants.array_y_axis_name];
            let color = controls[i].color;
            let startIndex = (axisName.includes('last10') ? 9 : 0)

            if (shapeIdx === PLOT_CROSS) {
                plotCross(windPlots, plotArea, 'speedLocationX', axisName, color, 7, startIndex);
            }
            if (shapeIdx === PLOT_LINE) {
                plotLine(windPlots, plotArea, 'speedLocationX', axisName, color, startIndex);
            }
            if (shapeIdx === PLOT_BOX) {
                plotPoint(windPlots, plotArea, 'speedLocationX', axisName, color, 3, startIndex);
            }
        }
    }

    generateWindDirectionArrows(windPlots, plotArea);
    generateDataTable('dataDisplay', windPlots);

}

function generateWindDirectionArrows(windPlots, plotArea) {

    windPlots.forEach(wp => {
        drawWindDir(wp.direction, wp.speedLocationX, plotArea.chartTop + 30, 'mediumvioletred', plotArea);
    });
};

function generateGrid(plotArea) {

    let positionX = plotArea.chartLeft;
    let ctx = plotArea.context;

    ctx.fillStyle = "#a1abd4";
    ctx.fillRect(0, 0, plotArea.width, plotArea.height);

    ctx.lineWidth = 1;
    ctx.setLineDash([1, 8]);
    ctx.strokeStyle = 'blue';

    while (positionX < plotArea.chartRight) {
        ctx.beginPath();
        ctx.moveTo(positionX, 0);
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
        ctx.moveTo(0 + 20, plotArea.chartBottom - yPos);
        ctx.lineTo(plotArea.chartRight, plotArea.chartBottom - yPos);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeText(knots, plotArea.chartRight - 30, plotArea.chartBottom - yPos - 7);

    }
    ctx.setLineDash([]);
    ctx.strokeStyle = 'black';

};

function GetCanvasInfo(canvasId, numberOfWindPlots) {
    const offset = WIND_PLOT_OFFSET;
    let canvasInstance = document.getElementById(canvasId);
    let ctx = canvasInstance.getContext("2d");
    let cWidth = canvasInstance.width;
    let cHeight = canvasInstance.height;

    let top = offset;
    let left = offset;
    let bottom = canvasInstance.height - offset;
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

function createWindPlots(WeatherData, plotArea) {


    let windPlots = [];
    let windAccum = 0;
    let gustAccum = 0;
    let windLast10 = [];
    let gustLast10 = [];


    //   let movingAverage = 0;
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

    while (docRef.rows.length > 1) {
        docRef.deleteRow(1);
    }

    windPlots.forEach(wp => {

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


// const PLOT_CONTROL_WIND_SPEED = 0;
// const PLOT_CONTROL_WIND_SPEED_SSEC_AVG = 1;
// const PLOT_CONTROL_WIND_SPEED_LAST_10_AVG = 2;
// const PLOT_CONTROL_WIND_SPEED_ACCUM_AVG = 3;
// const PLOT_CONTROL_GUST = 4;
// const PLOT_CONTROL_GUST_LAST_10 = 5;

// const PLOT_CONTROL_ARRAY_TOGGLE = 0;
// const PLOT_CONTROL_ARRAY_COLOR = 1;
// const PLOT_CONTROL_ARRAY_SHAPE = 2;
// const PLOT_CONTROL_ARRAY_LOCATION = 2;
// const PLOT_CONTROL_ARRAY_Y_AXIS_NAME = 3;

// const MENDOTA_BUOY_WIND_SPEED = 0;
// const MENDOTA_BUOY_GUST = 1;
// const MENDOTA_BUOY_RUN_WIND_SPEED = 2;
// const MENDOTA_BUOY_WIND_DIRECTION = 3;
// const MENDOTA_BUOY_AIR_TEMP = 4;
// const MENDOTA_BUOY_WATER_TEMP_2 = 5;
// const AOSS_TOWER_PRESSURE = 6;
// const PLOT_TIME = 7;