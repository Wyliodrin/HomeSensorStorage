

function ThermometerWidget ()
{
	this.id = 'thermometer';
	this.name =  'Thermometer';
	this.description = 'A Thermometer Widget';
	this.parameters = {
		
		min:
		{
			type:'double',
			text: 'Minimum value',
			value: 0
		},

		max:
		{
			type:'double',
			text: 'Maximum value',
			value: 100
		},

	};
	this.style = 'background-color: #ffffff',
	this.image = null;

	this.element = "canvas";
	this.value = 0;

	this.signals = [];

	this.nsmax = 1;

	this.mustUpdate = false;

	this.nr = null;
}

ThermometerWidget.id = 'thermometer';

ThermometerWidget.prototype = new Widget();
ThermometerWidget.prototype.constructor = ThermometerWidget;

ThermometerWidget.prototype.resize = function (nr)
{
	if (image)
	{
		image.Redraw ();
	}
}

ThermometerWidget.prototype.addValueToSignal = function (name, value, ts, text)
{
	console.log ('signals[0] '+this.signals[0].name);
	console.log ('name '+name);
	if (this.signals && this.signals[0] && this.signals[0].name == name.toLowerCase())
	{
		this.mustUpdate = true;
		this.value = value;
	}
}

ThermometerWidget.prototype.update = function ()
{
	if (this.mustUpdate && this.nr)
	{
		RGraph.Clear (document.getElementById (this.nr));
		this.image.value = this.value;
		this.image.Draw ();
		this.mustUpdate = false;
	}
}

ThermometerWidget.prototype.draw = function (nr)
{
		console.log (nr);
		element = $('#'+nr);
		this.nr = nr;
		element.attr ('width', 80);
		RGraph.Reset (nr);

		var div = $("#" + nr);

		var min = this.parameters.min.value;
		var max = this.parameters.max.value

		if( this.value > max ) max = this.value;

		this.image = new RGraph.Thermometer(nr, min, max, this.value)
					.Set('scale.visible', true);
		// this.image.Grow ({frames:60});
		// var grad = this.image.context.createLinearGradient(0,50,0,div.height());
  //       grad.addColorStop(0, this.parameters.highColor.value);
  //       grad.addColorStop(1, this.parameters.lowColor.value);

		// this.image.set ('chart.colors', [grad]);

	 //    for (var key in this.parameters)
		// {
		// 	var parameter = this.parameters[key];
		// 	if(parameter.value)
		// 		image.Set (key, parameter.value);
		// 	else
		// 		image.Set (key, parameter.default);
		// }

		this.image.Draw();
}

ThermometerWidget.prototype.drawImage = function (id, width, height)
{
	try
	{
		if (!width) width = 80;
		if (!height) height = 140;
		console.log ('id: '+id);
		element = $('#'+id);
		element.attr ('width', width);
		element.attr ('height', height);
		var example = new RGraph.Thermometer(id, 0, 100, 20)
			.Set('chart.labels.count', 4)
			.Set('chart.colors', ['red']);
	    example.Draw ();
	}
	catch(e)
	{
		console.log(e);
	}
    //removeClickEventListener (example);
}


registerWidget (ThermometerWidget);
