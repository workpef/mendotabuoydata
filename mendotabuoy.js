//const fetch = require('node-fetch');
//#region  Enums and Constants
class ChartElement {
    constructor(
        name,
        classification,
        origin,
        sourceElement,
        checkBoxID,
        colorInputID,
        selectedShapeID,
        rangeForAverage,
        targetChart,
        dataTableSortOrder,
        dataTableHeader

    ) {
        this.name = name;
        this.classification = classification;
        this.origin = origin;
        this.sourceElement = sourceElement;
        this.checkBoxID = checkBoxID;
        this.colorInputID = colorInputID;
        this.selectedShape = selectedShapeID;
        this.coordinates = null;
        this.data = null;
        this.rangeForAverage = rangeForAverage;
        this.targetChart = targetChart;
        this.dataTableSortOrder = dataTableSortOrder;
        this.dataTableHeader = dataTableHeader;
    };
};

class PlotCoordinate { constructor(x, y) { this.x = x; this.y = y; } }

class MeasureClassification {
    static _Wind = 'wind';
    static _Temperature = 'temp';
    static _Pressure = 'pressure';
    static _Direction = 'direction';
    static _Time = 'time';
    static get Wind() { return this._Wind; }
    static get Temperature() { return this._Temperature; }
    static get Pressure() { return this._Pressure; }
    static get Direction() { return this._Direction; }
    static get Time() { return this._Time; }
};
class MeasureOrigin {

    static _URL = 'url';
    static _Calculated = 'Calculated';
    static get URL() { return this._URL; }
    static get Calculated() { return this._Calculated; }
};
class PlotSymbol {
    static _line = 'Line';
    static _block = 'Block';
    static _cross = 'Cross';

    static get Line() { return this._line };
    static get Block() { return this._block };
    static get Cross() { return this._cross } ''
}
class Constants {

    static _MetaMeaName = 0;
    static _MetaMeaType = 1;
    static _MetaMeaSource = 2;
    static _MainCanvasName = 'windPlots';
    static _WindPlotOffset = 40;
    static _yAxisMultiplier = 20;
    static _TimeFormat = 'en-GB';
    static _MainChart = 'windPlots';
    static _PopupChart = 'popUp';
    static _WindDirLocAbove = 'Above';
    static _WindDirLocPlot = 'On Plot';
    static _WindDirLocBelow = 'Below';


    static get META_MEA_NAME() { return this._MetaMeaName; }
    static get META_MEA_TYPE() { return this._MetaMeaType; }
    static get META_MEA_SOURCE() { return this._MetaMeaSource; }
    static get MAIN_CANVAS_NAME() { return this._MainCanvasName; }
    static get WIND_PLOT_OFFSET() { return this._WindPlotOffset; }
    static get Y_AXIS_MULTIPLIER() { return this._yAxisMultiplier; }
    static get TIME_FORMAT() { return this._TimeFormat; }
    static get MAIN_CHART() { return this._MainChart; }
    static get POPUP_CHART() { return this._PopupChart; }

    static get WIND_DIR_ABOVE() { return this._WindDirLocAbove; }
    static get WIND_DIR_PLOT() { return this._WindDirLocPlot; }
    static get WIND_DIR_BELOW() { return this._WindDirLocBelow; }

}
//#endregion

//#region  assemble measures ================================================================
const measures = {};

measures['mendota.buoy.wind_speed'] = new ChartElement('mendota.buoy.wind_speed', MeasureClassification.Wind, MeasureOrigin.URL, null, 'buoyWindSpeedCb', 'buoyWindSpeedClr', 'buoyWindSpeedShape', undefined, Constants.MAIN_CHART, 2, 'Buoy Wind');
measures['mendota.buoy.gust'] = new ChartElement('mendota.buoy.gust', MeasureClassification.Wind, MeasureOrigin.URL, null, 'buoyGustCb', 'buoyGustClr', 'buoyGustShape', undefined, Constants.MAIN_CHART, 7, 'Buoy Gust');
measures['mendota.buoy.run_wind_speed'] = new ChartElement('mendota.buoy.run_wind_speed', MeasureClassification.Wind, MeasureOrigin.URL, null, 'buoyRunWindCb', 'buoyRunWindClr', 'buoyRunWindShape', undefined, Constants.MAIN_CHART, 3, '2 Mn Avg');
measures['mendota.buoy.wind_direction'] = new ChartElement('mendota.buoy.wind_direction', MeasureClassification.Direction, MeasureOrigin.URL, null, 'buoyWindDirCb', 'buoyWindDirClr', 'buoyWindDirLocation', undefined, Constants.MAIN_CHART, 6, 'Buoy Dir');
measures['mendota.buoy.air_temp'] = new ChartElement('mendota.buoy.air_temp', MeasureClassification.Temperature, MeasureOrigin.URL, null, 'buoyAirTemp', 'buoyAirTemp', 'buoyAirTemp', undefined, Constants.POPUP_CHART, 10, 'Buoy Air Temp');
measures['mendota.buoy.water_temp_2'] = new ChartElement('mendota.buoy.water_temp_2', MeasureClassification.Temperature, MeasureOrigin.URL, null, 'buoyWaterTemp', 'buoyWaterTemp', 'buoyWaterTemp', undefined, Constants.POPUP_CHART, 11, 'Water Temp');
measures['aoss.tower.pressure'] = new ChartElement('aoss.tower.pressure', MeasureClassification.Pressure, MeasureOrigin.URL, null, 'aossPressure', 'aossPressure', 'aossPressure', undefined, Constants.POPUP_CHART, 16, 'Pressure');
measures['aoss.tower.wind_speed'] = new ChartElement('aoss.tower.wind_speed', MeasureClassification.Wind, MeasureOrigin.URL, null, 'aossWindSpeedCb', 'aossWindSpeedClr', 'aossWindSpeedShape', undefined, Constants.MAIN_CHART, 12, 'Twr Wind');
measures['aoss.tower.wind_direction'] = new ChartElement('aoss.tower.wind_direction', MeasureClassification.Direction, MeasureOrigin.URL, null, 'aossWindDirCb', 'aossWindDirClr', 'aossWindDirLocation', undefined, Constants.MAIN_CHART, 15, 'Twr Dir');
measures['aoss.tower.air_temp'] = new ChartElement('aoss.tower.air_temp', MeasureClassification.Temperature, MeasureOrigin.URL, null, 'aossAirTemp', 'aossAirTemp', 'aossAirTemp', undefined, Constants.POPUP_CHART, 17, 'Twr Air Temp');
measures['timeStamp'] = new ChartElement('timeStamp', MeasureClassification.Time, null, null, '', '', '', undefined, undefined, undefined, 'DateTime');
measures['plotTimeStamp'] = new ChartElement('plotTimeStamp', MeasureClassification.Time, MeasureOrigin.Calculated, null, '', '', '', undefined, undefined, 1, 'Time');
measures['BuoyWindRunAvg'] = new ChartElement('BuoyWindRunAvg', MeasureClassification.Wind, MeasureOrigin.Calculated, 'mendota.buoy.wind_speed', 'buoyWindCalcAvgCb', 'buoyWindCalcAvgClr', 'buoyWindCalcAvgShape', 1, Constants.MAIN_CHART, 4, 'Buoy Run Avg');
measures['BuoyWindRangeAvg'] = new ChartElement('BuoyWindRangeAvg', MeasureClassification.Wind, MeasureOrigin.Calculated, 'mendota.buoy.wind_speed', 'buoyWindRngAvgCb', 'buoyWindRngAvgClr', 'buoyWindRngAvgShape', 10, Constants.MAIN_CHART, 5, 'Buoy Rng Avg');
measures['TowerWindRunAvg'] = new ChartElement('TowerWindRunAvg', MeasureClassification.Wind, MeasureOrigin.Calculated, 'aoss.tower.wind_speed', 'aossWindCalcAvgCb', 'aossWindCalcAvgClr', 'aossWindCalcAvgShape', 1, Constants.MAIN_CHART, 13, 'Twr Run Avg');
measures['TowerWindRangeAvg'] = new ChartElement('TowerWindRangeAvg', MeasureClassification.Wind, MeasureOrigin.Calculated, 'aoss.tower.wind_speed', 'aossWindRngAvgCb', 'aossWindRngAvgClr', 'aossWindRngAvgShape', 10, Constants.MAIN_CHART, 14, 'Twr Rng Avg');
measures['BuoyGustRunAvg'] = new ChartElement('BuoyGustRunAvg', MeasureClassification.Wind, MeasureOrigin.Calculated, 'mendota.buoy.gust', 'buoyGustCalcAvgCb', 'buoyGustCalcAvgClr', 'buoyGustCalcAvgShape', 1, Constants.MAIN_CHART, 8, 'Gust Run Avg');
measures['BuoyGustRangeAvg'] = new ChartElement('BuoyGustRangeAvg', MeasureClassification.Wind, MeasureOrigin.Calculated, 'mendota.buoy.gust', 'buoyGustRngAvgCb', 'buoyGustRngAvgClr', 'buoyGustRngAvgShape', 10, Constants.MAIN_CHART, 9, 'Gust Rng Avg');

const getAverages = Object.values(measures).filter(rec => rec.classification === MeasureClassification.Wind && rec.origin === MeasureOrigin.Calculated);
const getDataStateRecordByName = function (targetName) { return Object.values(measures).filter(rec => rec.name === targetName)[0] };
//#endregion ===========================================  assemble measures

const chartCoordinates = {};



function collectData() {

    let depth = document.querySelector('#windhistdisplay').value;
    let userDate = document.getElementById("histDate").value;
    let userTime = document.getElementById("histTime").value;
    let endDate = new Date(new Date(userDate + ' ' + userTime).toUTCString());
    let uppderBnd = new Date(endDate.toUTCString());
    let lowerBnd = setWindHistDepth(uppderBnd, - Number(depth));

    let url =
        'https://metobs.ssec.wisc.edu/api/data.json?' +
        'symbols=' + Object.values(measures).filter(rec => rec.origin === MeasureOrigin.URL).reduce((str, rec) => str + rec.name + ':', '').slice(0, -1) +
        '&begin=' + formatDateForURL(lowerBnd) +
        '&end=' + formatDateForURL(uppderBnd) +
        '&order=column';

    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then((x) => {

            res = x.results;
            ssecData = res.data;
            ssecData['timeStamp'] = res.timestamps;
            let nbrOfElements = ssecData['mendota.buoy.wind_speed'].length;  //any measure will do....

            /* Convert wind to knots
            =======================================*/
            const MS_TO_KNOTS_CONVERSION = function (speed) { return (speed * 1.944) };
            Object.values(measures)
                .filter(rec => rec.classification === MeasureClassification.Wind && rec.origin === MeasureOrigin.URL)
                .forEach(rec => { rec.data = ssecData[rec.name].map(rec => Number(Number.parseFloat(MS_TO_KNOTS_CONVERSION(rec)).toFixed(1))) });

            /* Convert temps to fahrenheit 
            ============================================*/
            const FAHRENHEIT_FORMULA = function (temp) { return (temp * (9 / 5)) + 32; };
            Object.values(measures)
                .filter(rec => rec.classification === MeasureClassification.Temperature && rec.origin === MeasureOrigin.URL)
                .forEach(rec => { rec.data = ssecData[rec.name].map(rec => Number(Number.parseFloat(FAHRENHEIT_FORMULA(rec).toFixed(1)))) });

            /* Collect wind direcction and barometric pressure
            ==================================================*/
            Object.values(measures)
                .filter(rec => (rec.classification === MeasureClassification.Direction || rec.classification === MeasureClassification.Pressure) && rec.origin === MeasureOrigin.URL)
                .forEach(rec => { rec.data = ssecData[rec.name].map(rec => rec) });

            /* Generate formatted time string for chart
            =================================================*/
            let ts = getDataStateRecordByName('timeStamp');
            ts.data = ssecData[ts.name];
            getDataStateRecordByName('plotTimeStamp').data = ts.data.map(x => { let d = new Date(x.replace('T', ' ').replace('Z', '')); return d.toTimeString(Constants.TIME_FORMAT).substring(0, 5) });

            /* Generate averages from parent data
            ===========================================*/
            getAverages.forEach(rec => { rec.data = generateRangeAvg(getDataStateRecordByName(rec.sourceElement).data, rec.rangeForAverage) });

            /* Calculate chart coordinates
            ==================================================*/
            let chartList = [Constants.MAIN_CHART, Constants.POPUP_CHART];
            chartList.forEach(chart => chartCoordinates[chart] = GetCanvasInfo(chart, nbrOfElements, Constants.WIND_PLOT_OFFSET));

            /* calculate each measure's X/Y position on chart
            ========================================================*/
            Object.values(measures)
                .filter(meaRec => meaRec.targetChart === Constants.MAIN_CHART && meaRec.classification === MeasureClassification.Wind)
                .forEach(rec => rec.coordinates = rec.data.map((mea, idx) => {
                    return new PlotCoordinate(
                        (chartCoordinates[rec.targetChart].plotSpan * idx) + chartCoordinates[rec.targetChart].chartLeft,
                        chartCoordinates[rec.targetChart].chartBottom - (Constants.Y_AXIS_MULTIPLIER * mea));
                })
                );
            /* reference wind coords in respective wind direction records
            =====================================================================*/
            measures["mendota.buoy.wind_direction"].coordinates = measures["mendota.buoy.wind_speed"].coordinates.slice(0);
            measures["aoss.tower.wind_direction"].coordinates = measures["aoss.tower.wind_speed"].coordinates.slice(0);

            redrawMainChart();
            generateDataTable('dataDisplay', measures);

        });

};

let aboutBoxHidden = true;
function toggleAboutDiv() {
    document.getElementById('aboutDiv').style.zIndex = aboutBoxHidden ? 30 : -30;
    aboutBoxHidden = !aboutBoxHidden;
    document.getElementById('about').innerHTML = aboutBoxHidden ? 'Show About' : 'Hide About';
}

let infoIsHidden = true;
function toggleInfo() {
    document.getElementById('infoBandDiv').style.zIndex = infoIsHidden ? 10 : -10;
    infoIsHidden = !infoIsHidden;
    document.getElementById('toggleInfo').innerHTML = infoIsHidden ? 'Show Temps & Pressure' : 'Hide Temps & Pressure';
}

let dataTableIsHidden = true;
function toggleDataTable() {
    let zidx = dataTableIsHidden ? 20 : -20;
    document.getElementById('dataDiv').style.zIndex = zidx;
    //   document.getElementById('innerDataDiv').style.zIndex = zidx;

    dataTableIsHidden = !dataTableIsHidden;
    document.getElementById('toggleDataTable').innerHTML = dataTableIsHidden ? 'Show Data Table' : 'Hide Data Table';
}

function generateRangeAvg(scrData, range) {

    const reduceRange = (accumulator, currentValue) => accumulator + currentValue;
    let avg = Array(scrData.length);
    avg.fill(0);
    for (let i = range; i < scrData.length; i++) {
        let start = range === 1 ? 0 : i - range;;
        let end = i;
        let divisor = range === 1 ? i : Math.min(range, i);
        avg[i] = Number(Number(scrData.slice(start, end).reduce(reduceRange) / divisor).toFixed(1));
    }
    if (range === 1) avg[0] = scrData[0];
    return avg;
}

function GetCanvasInfo(canvasId, numberOfWindPlots, offset) {

    let canvasInstance = document.getElementById(canvasId);
    let ctx = canvasInstance.getContext("2d");
    let cWidth = canvasInstance.width;
    let cHeight = canvasInstance.height;

    let top = offset;
    let left = offset;
    let bottom = cHeight - (offset + 40);
    let right = cWidth - offset;
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


//#region  Date Functions
/* Format the the date for the request
=====================================================*/
function formatDateForURL(date) {
    return date.toISOString().substring(0, 10) + 'T' + date.toLocaleTimeString(Constants.TIME_FORMAT);
}

/* Establish the request start date/time
============================================================*/
function setWindHistDepth(date, minutes) {
    return new Date(date.getTime() + (minutes * 60000));
};

//#endregion

//#region  display functions

function redrawMainChart() {

    renderWindGrid(chartCoordinates[Constants.MAIN_CHART], '#eae6fa', '#000000', '#ff0000', measures['plotTimeStamp'].data);

    /* Wind 
    ===============================*/
    Object.values(measures)
        .filter(rec => rec.classification === MeasureClassification.Wind && document.getElementById(rec.checkBoxID).checked)
        .forEach(rec => drawWindPlot(
            rec.coordinates,
            document.getElementById(rec.selectedShape).value,
            document.getElementById(rec.colorInputID).value,
            rec.rangeForAverage,
            chartCoordinates[Constants.MAIN_CHART],
            3,
            7));

    Object.values(measures)
        .filter(rec => rec.classification === MeasureClassification.Direction && document.getElementById(rec.checkBoxID).checked)
        .forEach(rec => drawWindDir(rec, chartCoordinates[Constants.MAIN_CHART]))

}

function drawWindDir(windDirRec, chart) {

    let ctx = chart.context;
    let lineLength = 25;
    let arrowOffset = 5;
    let color = document.getElementById(windDirRec.colorInputID).value;
    let location = document.getElementById(windDirRec.selectedShape).value;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    /* Draw Arrow 
       Conceptually we are drawing a horizontal arrow
       so subtract 90 degrees from the wind direction
       and then "rotate"
    ---------------------------------------------------*/
    windDirRec.coordinates.forEach((rec, idx) => {

        let y = rec.y;

        if (location === Constants.WIND_DIR_ABOVE)
            y = chart.chartTop + 30;
        else if (location === Constants.WIND_DIR_BELOW)
            y = chart.chartBottom - 20;

        ctx.translate(rec.x, y);     // set origin
        ctx.rotate((windDirRec.data[idx] - 90) * Math.PI / 180);  // rotate axis
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

    });



};

function drawWindPlot(positions, style, color, startPosition, chart, blockEdge, crossLength) {

    let ctx = chart.context;
    let edge = isNaN(blockEdge) ? 3 : blockEdge;
    let corner = edge * 2;
    let crossSegment = isNaN(crossLength) ? 3 : crossLength / 2;

    startPosition = isNaN(startPosition) ? 0 : Math.max(startPosition, 0);
    let positionToPlot = positions.slice(startPosition);
    let lastIdx = positionToPlot.length - 1;

    let saveStrokeStyle = ctx.strokeStyle;
    let savefillStyle = ctx.fillStyle;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    console.log(style, edge, corner);
    positionToPlot.forEach((pos, idx) => {

        if (style === PlotSymbol.Line && idx < lastIdx) {
            let nextPlot = idx + 1;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(positionToPlot[nextPlot].x, positionToPlot[nextPlot].y);
            ctx.stroke();
        }

        if (style === PlotSymbol.Block) {

            ctx.fillRect(pos.x - edge, pos.y - edge, corner, corner);
        }

        if (style === PlotSymbol.Cross) {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y - crossSegment);
            ctx.lineTo(pos.x, pos.y + crossSegment);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pos.x - crossSegment, pos.y);
            ctx.lineTo(pos.x + crossSegment, pos.y);
            ctx.stroke();
        }
    })

    ctx.strokeStyle = saveStrokeStyle;
    ctx.fillStyle = savefillStyle;
}

function renderWindGrid(chartCoords, chartColor, vertLineColor, horzLineColor, timeValues) {

    let positionX = chartCoords.chartLeft;
    let positionCount = 1;
    let ctx = chartCoords.context;
    let savedFillStyle = ctx.fillStyle;
    let savedStrokeStyle = ctx.strokeStyle;

    ctx.fillStyle = chartColor; //'#eae6fa';
    ctx.fillRect(0, 0, chartCoords.width, chartCoords.height);

    // draw vertical lines
    // ===========================================
    ctx.lineWidth = 1;

    while (positionX < chartCoords.chartRight) {

        if (positionCount % 10 === 0) {
            ctx.lineWidth = .5;
            ctx.setLineDash([]);
            ctx.strokeStyle = vertLineColor;
            {
                ctx.translate(positionX - chartCoords.plotSpan, chartCoords.chartBottom + 35);     // set origin
                ctx.rotate(-Math.PI / 3);
                ctx.font = '12px sans-serif';
                ctx.fillStyle = horzLineColor;
                ctx.fillText(timeValues[positionCount - 1], 0, 0);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            ctx.beginPath();
            ctx.moveTo(positionX, chartCoords.chartTop);
            ctx.lineTo(positionX, chartCoords.chartBottom);
            ctx.stroke();
        }
        else {
            ctx.setLineDash([1, 8]);
            ctx.strokeStyle = vertLineColor;
            ctx.lineWidth = 1;
        }
        // ctx.beginPath();
        // ctx.moveTo(positionX, chartCoords.chartTop);
        // ctx.lineTo(positionX, chartCoords.chartBottom);
        // ctx.stroke();
        positionX = positionX + chartCoords.plotSpan;
        positionCount += 1;
    };

    // draw horizontal lines
    // ======================================
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 6]);
    ctx.strokeStyle = horzLineColor; //'red';
    ctx.font = '12px serif';
    [5, 10, 15, 20, 25, 30].forEach(speed => {
        let yPos = speed * Number(Constants.Y_AXIS_MULTIPLIER);
        let knots = speed.toString();
        ctx.setLineDash([1, 6]);
        ctx.beginPath();
        ctx.moveTo(chartCoords.chartLeft, chartCoords.chartBottom - yPos);
        ctx.lineTo(chartCoords.chartRight, chartCoords.chartBottom - yPos);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeText(knots, chartCoords.chartRight + 5, chartCoords.chartBottom - yPos + 3);
    })
    // clean up
    //==================================
    ctx.setLineDash([]);
    ctx.fillStyle = savedFillStyle;
    ctx.strokeStyle = savedStrokeStyle;
};

//#endregion


//#region  execution ========================================


// const defaultDepth = 75;
// let endDate = new Date(new Date('2020-07-19' + ' ' + '15:30').toUTCString());
// let uppderBnd = new Date(endDate.toUTCString());
// let lowerBnd = setWindHistDepth(uppderBnd, - Number(defaultDepth));

//collectData(lowerBnd, uppderBnd);

function show(dt) { console.log(dt) };


setTimeout(() => {
    let x = '';


}, 300);

//show('end end');

//#endregion execution ========================================

function showWindHist(hist) {
    document.querySelector('#windhistdisplay').value = hist;
}


function generateDataTable(tableId, measures) {
    let docRef = document.getElementById(tableId);
    let entryNo = 0;


    while (docRef.rows.length > 4) {
        docRef.deleteRow(-1);
    }

    let reducedMeasures = Object.values(measures)
        .filter((rec) => rec.dataTableSortOrder !== undefined)
        .map((rec) => { return [rec.dataTableSortOrder, rec.data, rec.dataTableHeader] })
        .sort((a, b) => {
            if (a[0] > b[0])
                return -1;
            else if (a[0] < b[0])
                return 1;
            else
                return 0;
        });

    let ordered = reducedMeasures.map((rec) => rec[1]);

    let controlArray = [...ordered[0]];

    for (let i = 0; i < controlArray.length; i++) {
        entryNo += 1;
        let nr = docRef.insertRow(-1);
        ordered.forEach(element => {
            let newCell = nr.insertCell(0);
            let data = document.createTextNode(element[i].toString());
            newCell.appendChild(data);
        });
        let rowno = nr.insertCell(0);
        let rowValue = document.createTextNode(entryNo);
        rowno.appendChild(rowValue);

    }



};

