$(document).ready(function()
{
	$("#ok_add_dashboard").click(function(){
		$(".add_dashboard").foundation("reveal", "close");
		var name = $("#add_dashboard_name").val();
		if(name.length > 0)
		{
			var description = $("#add_dashboard_description").val();
			$.post("/add_dashboard",{name:name, description:description}, function(response, textStatus){
				if(response.status == "done")
				{
					var dashboardid = response.id;
					addDashboard(name, dashboardid, 0, 0,[],[]);
				}
			});
		}
	});

	$("#cancel_add_dashboard").click(function(){
		$(".add_dashboard").foundation("reveal", "close");
	});

   $.post("/get_dashboards",function(dash, textStatus){
    	for(var i=0; i<dash.length; i++)
    	{
    		var d = dash[i];
    		getGraphs(d);
    	}
    }); 
});

function addDashboard(name, dashboardid, buttons, sensors, graphType)
{
	var myDashboard = $(".my_dashboard").clone();
	myDashboard.removeClass("template dashboard");
	myDashboard.find(".sensors_count").append(sensors);
	myDashboard.find(".buttons_count").append(buttons);
	myDashboard.find(".boards_count").append("-");
	var url = "dashboard/"+dashboardid;
	myDashboard.find(".dash_name").text(name).attr("href", url);

	for(var i=0; i<graphType.length; i++)
	{
		var g = graphType[i];
		console.log(g);
	 	var graphPrev = $(".graph_preview").clone();
		graphPrev.removeClass("template graph_preview");
		graphPrev.find(".graph_preview_name").text(g.name);
		graphPrev.find(".graph_preview_image").attr("src","/img/"+g.type+".png");
		myDashboard.find(".graph_prev").append(graphPrev);
	}	

	$("#dashboard_list").append(myDashboard);
	$("#dashboard_list").append("<hr/>");

}

function getGraphs(dashboard)
{
	var dashboardid = dashboard.id;
	$.post("/get_dash_graph", {"dashboardid":dashboardid}, function(response,textStatus){
		if(response.status == "done")
		{
			var graphs = response.graphs;
			var sensors = 0;
			var buttons = 0;
			var graphsPreview = [];
			for(var j=0; j<graphs.length; j++)
			{
				console.log(j);
				var g = graphs[j];
				if((g.type == "button_check") || (g.type == "button_slide"))
					buttons++;
				else
				{
					sensors++;
					if(graphsPreview.length<4)
						graphsPreview.push(g);
				}
			}
			console.log("sensors");
			addDashboard(dashboard.name, dashboardid, buttons, sensors, graphsPreview);
		}
});
}