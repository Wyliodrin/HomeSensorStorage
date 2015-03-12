function SplineLineWidget()
{
	this.id = 'splineline';
	this.name = 'Spline Line';
	this.description = 'A Spline line widget';

	this.signals = [];

	this.options =
	{
		series: 
		{
			
		},
		type:'spline'
	};

	this.parameters.title.value = this.name;
}


SplineLineWidget.id = 'splineline';
SplineLineWidget.prototype = new MyLineWidget();
SplineLineWidget.prototype.constructor = SplineLineWidget;

registerWidget(SplineLineWidget);
