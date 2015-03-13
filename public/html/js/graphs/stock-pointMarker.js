function PointMarkerWidget()
{
	this.id = 'point-marker';
	this.name = 'Point Marker';
	this.description = 'Point marker only widget';
	this.style = 'background-color: #ffffff';
	this.image = null;

	this.parameters.title.value = this.name;

	this.options =
	{
		series:
		{
			marker:
			{
				enabled: true,
				radius: 3
			},
			
			lineWidth: 0
		},
		points: true
	}

	this.sinals = [];
}


PointMarkerWidget.id = 'point-marker';
PointMarkerWidget.prototype = new MyLineWidget();
PointMarkerWidget.prototype.constructor = PointMarkerWidget;

registerWidget(PointMarkerWidget);
