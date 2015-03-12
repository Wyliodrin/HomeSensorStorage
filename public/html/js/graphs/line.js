/**
 * Created by victor-vm on 3/12/2015.
 */

//MyGraph.prototype.options



function myGraph(){
    this.graph;

    //this.signals=[];

    this.series=[];

    this.container;
}
myGraph.prototype.setGraph=function(graph){
    this.graph=graph;
}

myGraph.prototype.setContainer=function(container){
    this.container=container;
}

myGraph.prototype.setSeries=function(series){
    this.series=series;
}

myGraph.prototype.addSignalsValues=function(signals){
    for(var signalIndex=0;signalIndex<this.graph.graphSignals.length;signalIndex++)
        for(var auxSignalIndex=0;auxSignalIndex<signals.length;auxSignalIndex++) {
            if (this.graph.graphSignals[signalIndex].signalId == signals[auxSignalIndex].signalInfo.signalId) {
                this.graph.graphSignals[signalIndex].signalValues = signals[auxSignalIndex].signalValues;
                console.log(this.graph.graphSignals[signalIndex].signalValues);
                //alert(JSON.stringify(signals[auxSignalIndex].signalValues));
            }
        }
                //for(var signalValueIndex=0;signalValueIndex<signals[auxSignalIndex].signalValues.length;signalValueIndex++)
                  //  this.graph.signals.
                    //this.signals[signalIndex].signalValues.push(signals[auxSignalIndex].signalValues[signalValueIndex]);
    this.createSeries();
    this.drawGraph();
}

myGraph.prototype.drawGraph=function(){
    this.container.highcharts('StockChart',
        {
            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'AAPL Stock Price'
            },

            series: this.series
        }
    );

}
myGraph.prototype.setSignals= function (signals) {
    this.signals=signals;
}

myGraph.prototype.createSeries= function () {
    var series=new Array();
    for(var index=0;index<this.signals.length;index++){
        if(this.graph.graphType=='line')
            series.push({
                name: this.signals[index].signalName,
                shadow: true,
                tooptip: {
                    valueDecimals: 2
                },
                data: this.signals[index].signalValues
            });
        else if(this.graph.graphType=='stepline')
            series.push({
                name: this.signals[index].signalName,
                shadow: true,
                tooptip: {
                    valueDecimals: 2
                },
                step: true,
                data: this.signals[index].signalValues
            });
        else if(this.graph.graphType=='spline')
            series.push({
                name: this.signals[index].signalName,
                shadow: true,
                tooptip: {
                    valueDecimals: 2
                },
                type:'spline',
                data: this.signals[index].signalValues
            });
        else if(this.graph.graphType=='point'){
            series.push({
                name: this.signals[index].signalName,
                shadow: true,
                tooptip: {
                    valueDecimals: 2
                },
                lineWidth: 0,
                marker : {
                    enabled : true,
                    radius : 2
                },
                data: this.signals[index].signalValues
            });
        }
    }
    this.series=series;
}

function MyLineWidget()
{
    this.id = 'myline';
    this.name = 'Line';
    this.description = 'A line widget';
    this.style = 'background-color: #ffffff';
    this.image = null;

    this.signals = [];

    this.options =
    {
        series: {},
        type:'line'
    }

    this.parameters =
    {
        title:
        {
            type: 'string',
            text: 'Name',
            value: this.name
        },

        hideLegend:
        {
            type: 'boolean',
            text: 'Hide legend',
            value: false
        },

        fixedAxis:
        {
            type: 'boolean',
            text: 'Fix axes values',
            value: false
        },

        minAxisValue:
        {
            type:'double',
            text: 'Minimum axes value',
            value: 0

        },

        maxAxisValue:
        {
            type:'double',
            text: 'Maximum axes value',
            value: 1000

        },

        showPoints:
        {
            type:'boolean',
            text: 'Show points',
            value: false

        },

        maxPoints:
        {
            type:'number',
            text: 'Maximum points to show (0 means show all)',
            value: 10

        },

        AxisName:
        {
            type: 'string',
            text: 'Axis name',
            value: ''
        },

        showOverview:
        {
            type: 'boolean',
            text: 'Show overview',
            value: false
        },

        showScrollbar:
        {
            type: 'boolean',
            text: 'Show scrollbar',
            value: false
        }
    };

    this.data = dictionary ();
}



MyLineWidget.id = 'myline';
MyLineWidget.prototype = new Widget();
MyLineWidget.prototype.constructor = MyLineWidget;


MyLineWidget.prototype.resize = function(nr)
{

}

MyLineWidget.prototype.addValueToSignal = function (name, value, ts, text)
{
    // console.log (ts);
    if (this.chart)
    {
        // console.log (this.chart.series[ns].points.length);
        if (name.indexOf ('debug_')!=0)
        {
            var series = this.chart.get (name);
            if (series)
            {
                this.mustUpdate = true;
                var out = (this.parameters.maxPoints.value > 0 && series.points.length >= this.parameters.maxPoints.value);
                series.addPoint ([ts*1000, value], false, out);
                if (text) this.addDebugToSignal (name, text, ts);
            }
        }
        else
        {
            name = name.substring (6);
            var series = this.chart.get (name);
            if (series)
            {
                this.mustUpdate = true;
                this.addDebugToSignal (name, text, ts);
            }
        }
    }
}

MyLineWidget.prototype.flagNr = function (flag)
{
    var n = -1;
    flag = flag.toLowerCase ();
    if (this.chart)
    {
        for (var ind=0; ind < this.chart.series.length; ind++)
        {
            if (this.chart.series[ind].name == 'debug_'+flag)
            {
                n = ind;
            }
        }
    }
    return n;
}

MyLineWidget.prototype.addDebugToSignal = function (name, value, ts)
{
    // console.log (ts);
    if (this.chart)
    {
        // console.log (value);
        // console.log (this.chart.series[ns].options.id);
        var series = this.chart.get ('debug_'+name);
        if (!series)
        {
            this.chart.addSeries ({type:'flags', name:'debug_'+name, id:'debug_'+name, data:[{x: ts*1000, title:value}], color:this.chart.get(name).options.color, onSeries:name, showInLegend: false});
        }
        else
        {
            var out = (this.parameters.maxPoints.value > 0 && series.points.length >= this.parameters.maxPoints.value);
            series.addPoint ({x: ts*1000, title:value}, false, out);
        }
    }
}

MyLineWidget.prototype.randomData =function ()
{
    var data = [];
    var min = this.parameters.minAxisValue.value;
    var max = this.parameters.maxAxisValue.value;
    for (var j=0; j<10; j++)
    {
        if (this.parameters.fixedAxis.value == true)
        {
            data.push ({x:j, y:min+Math.random()*(max-min)});
        }
        else
        {
            data.push ({x:j, y:Math.random()*1000});
        }
    }
    // console.log (data);
    return data;
}

MyLineWidget.prototype._addSignal2 =function (signal)
{
    // console.log ('SIGNAL');
    // console.log (signal);
    var data = this.data.get(signal.name);
    if (!data)
    {
        if (!readonly) data = this.randomData();
        else data = [];
    }
    // console.log (data);
    // console.log (signal);
    this.chart.addSeries ({name:signal.name, id:signal.name, data:data, color:signal['color']}, true);
}

// MyLineWidget.prototype._removeSignal =function (nrsignal)
// {
// 	if (this.chart)
// 	{
// 		var series = this.chart.get (this.signals[nrsignal].name);
// 		if (series) series.remove (true);
// 	}
// }

// MyLineWidget.prototype._setSignalValue =function (nrsignal, key, value)
// {
// 	if (this.chart)
// 	{
// 		var series = this.chart.get (this.signals[nrsignal].name);
// 		series.remove ();
// 		this._addSignal ({name: this.signals[nrsignal].name, color: this.signals[nrsignal].color});
// 	}
// }

MyLineWidget.prototype.update = function ()
{
    // console.log ('update');
    if (this.mustUpdate && this.chart)
    {
        // console.log ('updating');
        this.mustUpdate = false;
        this.chart.redraw ();
    }
}

myGraph.prototype.drawGraph=function(){

    var series=this.createSeries();

    this.chart=this.container.highcharts('StockChart',
        {
            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'AAPL Stock Price'
            },

            series: this.series
        }
    );

}

MyLineWidget.prototype.draw = function(nr, samples)
{
    console.log ('draw');
    var div = $("#" + nr);
    div.width(div.parent().width());
    div.height(div.parent().height()-20);
    //element.attr ('width', div.parent().width());
    //element.attr ('height', div.parent().height()-20);
    // console.log(div);
    // $.plot("#" + nr,this.data);
    // console.log("MY LINE!");
    // console.debug(this.data);
    // var signals = this.signals;
    // var lastTimestamp = this.lastTimestamp;
    // var myThis = this;

    var that = this;

    if (!this.options.points)
        this.options.series.marker = {
            enabled: this.parameters.showPoints.value
        };

    if (this.chart)
    {
        // console.log (this.chart.series.length);
        for (var s=0; s<this.signals.length; s++)
        {
            var data = [];
            var series = this.chart.get (this.signals[s].name);
            if (series)
            {
                series.data.forEach (function (p)
                {
                    data.push ({x:p.x, y:p.y});
                });
                // console.log (this.signals[s].name);
                this.data.set (this.signals[s].name, data);
                // console.log ('data');
                // console.log (data);
            }
            var debug_series = this.chart.get ('debug_'+this.signals[s].name);
            if (debug_series)
            {
                debug_series.data.forEach (function (p)
                {
                    data.push ({x:p.x, y:p.y});
                });
                // console.log (this.signals[s].name);
                this.data.set (this.signals[s].name, data);
                // console.log ('data');
                // console.log (data);
            }
        }
        this.chart.destroy ();
        // this.chart.setSize (div.width(), div.height());
    }
    //else
    //{

    mySeries = [];


    // console.log("MY!");
    // console.debug(this.data);
    // console.log("TEST!");

    $('#'+nr).highcharts('StockChart', {
            chart: {
                type: that.options.type,
                animation: that.options.animation,
                events : {

                }},

            rangeSelector : {
                enabled: false
            },

                exporting: {
                    enabled: true
                },

                credits:
                {
                enabled: false
            },


            title : {
                text : that.parameters.title.value
            },

            plotOptions:
            {
                series: that.options.series
            },

            legend: {
                enabled: that.parameters.hideLegend.value == false,
                align: 'right',
                // backgroundColor: '#FCFFC5',
                // borderColor: 'black',
                // borderWidth: 2,
                layout: 'vertical',
                verticalAlign: 'top',
                y: 100,
                shadow: false
            },

            yAxis:
            {
                min: (that.parameters.fixedAxis.value)?that.parameters.minAxisValue.value:undefined,
                max: (that.parameters.fixedAxis.value)?that.parameters.maxAxisValue.value:undefined
            },

            navigator:
            {
                enabled: that.parameters.showOverview.value
            },

            scrollbar:
            {
                enabled: that.parameters.showScrollbar.value
            },

            series : []
        },
        function (chart)
        {
            that.chart = chart;
        });

    for(var i=0;i<this.signals.length;i++)
    {
        var signal = this.signals[i];
        //fiecare widget va contine un dictionar care are cheie numele semnalului si obiectul asociat cheii
        //va fi contine seria si last timestamp pentru semnalul respectiv
        this._addSignal2 (signal);

        // this.data[signal['name']] = {series : mySeries, timestamp : 0};
    }
    //}
}

// MyLineWidget.prototype.testAddValues = function()
// {
// 	this.addValues([
// 					{"name": "signal", "value": {"*": 5, "x": 10, "y": 20, "z": 30}, "timestamp": 800},
// 					{"name": "signal", "value": {"*": 10, "x": 20, "y": 50, "z": 40}, "timestamp": 450},
// 					{"name": "signal", "value": {"x": 11, "y": 22, "z": 33}, "timestamp": 100},
// 					{"name": "signal", "value": {"*": 10, "x": 20, "y": 30, "z": 40}, "timestamp": 400},
// 					{"name": "signal", "value": {"*": 15, "x": 20, "y": 50, "z": 40}, "timestamp": 350},
// 					{"name": "signal", "value": {"x": 44, "y": 55, "z": 66}, "timestamp": 200},
// 					{"name": "signal", "value": {"*": 5, "x": 10, "y": 20, "z": 30}, "timestamp": 300},
// 					{"name": "signal", "value": {"*": 5, "x": 10, "y": 20, "z": 30}, "timestamp": 900},
// 					{"name": "signal", "value": {"*": 5, "x": 10, "y": 20, "z": 30}, "timestamp": 500},
// 					{"name": "signal", "value": {"*": 5, "x": 10, "y": 20, "z": 30}, "timestamp": 700},
// 					{"name": "signal", "value": {"*": 5, "x": 10, "y": 20, "z": 30}, "timestamp": 650},
// 					{"name": "signal", "value": {"*": 5, "x": 10, "y": 20, "z": 30}, "timestamp": 1000}
// 					]);
// }
