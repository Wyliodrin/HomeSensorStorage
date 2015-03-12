function StepLineWidget()
{
	this.id = 'stepline';
	this.name = 'Step Line';
	this.description = 'A Step line widget';
	
	this.signals = [];

	this.options =
	{
		series: 
		{
			step:true
		},
		type:'line',
		animation: false
	};

	this.parameters.title.value = this.name;
}


StepLineWidget.id = 'stepline';
StepLineWidget.prototype = new MyLineWidget();
StepLineWidget.prototype.constructor = StepLineWidget;

registerWidget(StepLineWidget);
