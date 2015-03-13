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
			value: true
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
			value: 100

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

MyLineWidget.prototype.numberOfPoints = function ()
{
	return this.parameters.maxPoints.value;
}

MyLineWidget.prototype.addValueToSignal = function (name, value, ts, text)
{
	// console.log (ts);
	var n = this.signalNr (name);
	if (n >= 0)
        if (!this.signals[n].ts || this.signals[n].ts < ts)
            this.signals[n].ts = ts;
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
                if(this.lastValueElement!=null)
                    this.lastValueElement.html(value);
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
		// if (!readonly) data = this.randomData();
		data = [];
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

MyLineWidget.prototype.draw = function(div, samples)
{
		console.log ('draw');
		 // div.width(div.parent().width());
		 // div.height(div.parent().height()-20);
		//  element.attr ('width', div.parent().width());
		// element.attr ('height', div.parent().height()-20);
		 // console.log(div);
		// $.plot("#" + nr,this.data);
		// console.log("MY LINE!");
		// console.debug(this.data);
		// var signals = this.signals;
		// var lastTimestamp = this.lastTimestamp;
		// var myThis = this;

		var that = this;

		if (!this.options.points) this.options.series.marker = {
			enabled: this.parameters.showPoints.value,
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

			div.highcharts('StockChart', {
				chart: {
					type: that.options.type,
					animation: that.options.animation,
				events : {
					
				}},

				rangeSelector : {
					enabled: false,
				},

				exporting: {
				enabled: true,
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
					series: that.options.series,
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
			    	enabled: that.parameters.showOverview.value,
			    },

			    scrollbar:
			    {
			    	enabled: that.parameters.showScrollbar.value,
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

registerWidget(MyLineWidget);
