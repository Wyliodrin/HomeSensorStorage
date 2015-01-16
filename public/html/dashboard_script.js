function addMyLine(s, container)
{
	console.log("ass");
	container.highcharts('StockChart', 
	{
		subtitle: {text: s.description},	
		title : {text : s.name},
		legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        rangeSelector : {
					enabled: false,
				},
		yAxis:{
			    	min: -10,
			    	max: 50
			   },
		series: [{data: []}]
		}
	);
}

function addStepLine(s, container)
{
	container.highcharts('StockChart', 
	{
		subtitle: {text: s.description},	
		title : {text : s.name},
		legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        rangeSelector : {
					enabled: false,
				},
		yAxis:{
			    	min: -10,
			    	max: 50
			   },
		series: [{data: [],step: true}]
		}
	);
}

function addThermometer(s,container)
{
	container.highcharts({
            chart: {
                type: 'column',
                marginBottom: 53
            },
            credits: {
                enabled: false
            },
            title: null,
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false   
            },
            yAxis: {
                min: 0,
                max: 100,
                title: null,
                align: 'right'
            },
            xAxis: {
                labels: false
            },
            series: [{
                data: [50],
                color: 'red'
             }]
        });
}

$(document).ready(function()
{
 	var url = window.location.pathname;
 	var dashboardid = url.substring("/dashboard/".length);
 	$.post("/get_dashboard",{id:dashboardid},function(dash, textStatus){
    	$("#my_dashboard_name").text(dash.name);
    	$("#key").text(dash.uuid);
    	$("#dashboard_description").text(dash.description);
    	$.post("/get_dash_graph",{dashboardid:dash.id},function(graphs, textStatus){
    		var buttons=[];
    		var sensors=[];
    		for(var i=0; i<graphs.length; i++)
    		{
    			var g = graphs[i];
    			if((g.type == "button_check") || (g.type == "button_slide"))
    				buttons.push(g);
    			else
    				sensors.push(g);
    		}
    		$("#sensor_count").append(sensors.length);
    		$("#button_count").append(buttons.length);
    		$("#board_count").append("-");
    		for(var i=0; i<buttons.length; i++)
    		{
    			console.log("in for");
    			var b = buttons[i];
    			if(b.type == "button_slide")
    			{
    				var myButton = $(".button_slide").clone();
					myButton.removeClass("template button_slide");
	    			$("#button_area").append(myButton);
	    			myButton.find(".button_name").text(b.name);
    			}
    			else if(b.type == "button_check")
    			{
    				var myButton = $(".button_check").clone();
					myButton.removeClass("template button_check");
	    			$("#button_area").append(myButton);
	    			myButton.find(".button_name").text(b.name);
    			}
    		}
    		for(var i=0; i<sensors.length; i++)
    		{
    			var s = sensors[i];
    			var mySensor = $(".chart_template").clone();
				mySensor.removeClass("template chart_template");
    			$("#sensor_area").append(mySensor);
    			if(s.type == "myline")
    				addMyLine(s,mySensor.find(".chart"));
    			else if(s.type == "stepline")
    				addStepLine(s, mySensor.find(".chart"));
    			else if(s.type == "thermometer")
    				addThermometer(s, mySensor.find(".chart"));
    		}
    	});
    });
});


