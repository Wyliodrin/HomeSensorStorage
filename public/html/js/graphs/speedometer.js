function SpeedometerWidget()
{
	this.id = 'speedometer';
	this.name = 'Speedometer';
	this.description = 'A Speedometer widget';
	this.style = 'background-color: #ffffff';
	this.image = null;

	this.signals = [];

	this.parameters = {

		lowColor:
		{
			type:'color',
			text:'Low color',
			value: '#00ff00'
		},

		lowValue:
		{
			type:'double',
			text:'Low value',
			value: 500
		},

		midColor:
		{
			type:'color',
			text:'Mid color',
			value: '#ffff00'
		},

		midValue:
		{
			type:'double',
			text:'Mid color',
			value: 700
		},

		highColor:
		{
			type:'color',
			text:'High color',
			value: '#ff0000'
		},

		minimum_value:
		{
			type: 'number',
			value: 0,
			text: 'Minumum value'
		},
		maximum_value:
		{
			type: 'number',
			value: 1023,
			text: 'Maximum value'
		},
		
		units:
		{
			type: 'string',
			text: 'Measurement units',
			value: 'km/h'
		}
	};

	this.mustUpdate = false;

	this.nsmax = 1;
}


SpeedometerWidget.id = 'speedometer';
SpeedometerWidget.prototype = new Widget();
SpeedometerWidget.prototype.constructor = SpeedometerWidget;

SpeedometerWidget.prototype.resize = function(nr)
{

}

SpeedometerWidget.prototype.addValueToSignalNr = function (ns, value, ts)
{
	if (this.chart)
	{
		this.chart.series[0].points[0].update (value, false);
		this.mustUpdate = true;
	}
}

SpeedometerWidget.prototype.update = function ()
{
	if (this.chart && this.mustUpdate)
	{
		this.mustUpdate = false;
		this.chart.redraw ();
	}
}

SpeedometerWidget.prototype.draw = function(div, samples)
{
		 /*var div = $("#" + nr);
		 div.width(div.parent().width());
		 div.height(div.parent().height()-20);
		 element.attr ('width', div.parent().width());
		element.attr ('height', div.parent().height()-20);
		 console.log(div);*/
		// $.plot("#" + nr,this.data);
		// console.log("MY LINE!");
		// console.debug(this.data);
		// var signals = this.signals;
		// var lastTimestamp = this.lastTimestamp;
		// var myThis = this;

		// mySeries = [];4

		if (this.chart)
		{
			this.chart.destroy ();
			// this.chart.setSize (div.width(), div.height());
			// return;
		}

		var that = this;
		
		// console.log("MY!");
		// console.debug(this.data);
		// console.log("TEST!");
		div.highcharts({
			chart: {
				type: 'gauge',
				plotBackgroundColor: null,
			    plotBackgroundImage: null,
				plotBorderWidth: 0,
				plotShadow: false,	        	
				spacingTop: 0,
				spacingLeft: 0,
				spacingRight: 0,
				spacingBottom: 0
			},
			exporting: {
				enabled: true
			},		
			title : {
				text : ''
			},
			credits: {
			      enabled: false
			},
			pane: {
				startAngle: -150,
				endAngle: 150,
				background: [{
					backgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, '#FFF'],
							[1, '#333']
						]
					},
					borderWidth: 0,
					outerRadius: '109%'
				}, {
					backgroundColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, '#333'],
							[1, '#FFF']
						]
					},
					borderWidth: 1,
					outerRadius: '107%'
				}, {
					// default background
				}, {
					backgroundColor: '#DDD',
					borderWidth: 0,
					outerRadius: '105%',
					innerRadius: '103%'
				}]
			},
			// the value axis
			yAxis: {
				min: that.parameters.minimum_value.value,
				max: that.parameters.maximum_value.value,
				
				minorTickInterval: 'auto',
				minorTickWidth: 1,
				minorTickLength: 10,
				minorTickPosition: 'inside',
				minorTickColor: '#666',

				tickPixelInterval: 30,
				tickWidth: 2,
				tickPosition: 'inside',
				tickLength: 10,
				tickColor: '#666',
				labels: {
					step: 2,
					rotation: 'auto'
				},
				title: {
					text: 'km/h'
				},
				plotBands: [{
					from: that.parameters.minimum_value.value,
					to: that.parameters.lowValue.value,
					color: that.parameters.lowColor.value // green
				}, {
					from: that.parameters.lowValue.value,
					to: that.parameters.midValue.value,
					color: that.parameters.midColor.value // yellow
				}, {
					from: that.parameters.midValue.value,
					to: that.parameters.maximum_value.value,
					color: that.parameters.highColor.value // red
				}]        
			},  
			series: [{
				name: that.signals[0].name,
				data: [50],
				tooltip: {
					valueSuffix: that.parameters.units.value
				}
			}]
		}, // end highchart function
		// Add some life
		function(chart) {
			that.chart = chart;
		});
}

SpeedometerWidget.prototype.drawImage = function(id, width,height)
{
		if (!width) width = 150;
		if (!height) height = 140;
		element = $('#'+id);
		element.attr ('width', width);
		element.attr ('height', height);
		
		element.width (width);
		element.height (height);

		$('#'+id).highcharts({	
			type: 'gauge',		
			title : {
				text : ''
			},
			credits: {
			      enabled: false
			},
			series: [{
	     			   data: [-20],
				   yAxis: 0
	  			}]			
		});
}

registerWidget(SpeedometerWidget);
