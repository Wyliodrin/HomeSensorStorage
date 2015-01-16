$(document).ready(function()
{
   $.post("/get_dashboards",function(dash, textStatus){
    	for(var i=0; i<dash.length; i++)
    	{
    		var d = dash[i];
    		getGraphs(d);
    	}
    }); 
});

function getGraphs(dashboard)
{
	var dashboardid = dashboard.id;
	$.post("/get_dash_graph", {"dashboardid":dashboardid}, function(graphs,textStatus){
	var sensors = 0;
	var buttons = 0;
	var graphType = [];
	for(var j=0; j<graphs.length; j++)
	{
		var g = graphs[j];
		if((g.type == "button_check") || (g.type == "button_slide"))
			buttons++;
		else
		{
			sensors++;
			if(graphType.length<3)
				graphType.push(g.type);
		}
	}
	var myDashboard = $(".dashboard").clone();
	myDashboard.removeClass("template dashboard");
	myDashboard.find(".sensors_count").append(sensors);
	myDashboard.find(".buttons_count").append(buttons);
	myDashboard.find(".boards_count").append("-");
	var url = "dashboard/"+dashboardid;
	myDashboard.find(".dash_name").text(dashboard.name).attr("href", url);
	$("#dashboard_list").append(myDashboard);
	$("#dashboard_list").append("<hr/>");
});
}