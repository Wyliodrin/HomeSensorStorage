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

    $("#ok_rename_dashboard").click(function(){
        $(".rename_dashboard").foundation("reveal","close");
        var id=$("#rename_dashboard_id").val();
        var name = $("#rename_dashboard_name").val();
        if(name.length > 0)
        {
            $.post("/rename_dashboard",{id:id, name:name}, function(response, textStatus){
                if(response.status == "done")
                {
                    var dashboards=$(".dashboard-item");
                    for(var index=0;index<dashboards.length;index++)
                        if($(dashboards[index]).find(".dashboard_id").val()==id) {
                            $(dashboards[index]).find(".dash_name").html(name);
                            break;
                        }
                }
            });
        }
    });

	$("#cancel_add_dashboard").click(function(){
		$(".add_dashboard").foundation("reveal", "close");
	});

    $("#cancel_rename_dashboard").click(function(){
        $(".rename_dashboard").foundation("reveal", "close");
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
	myDashboard.removeClass("template my_dashboard");
	myDashboard.find(".sensors_count").append(sensors.length);
	myDashboard.find(".buttons_count").append(buttons.length);
	myDashboard.find(".boards_count").append("-");
	var url = "dashboard/"+dashboardid;
	myDashboard.find(".dash_name").text(name).attr("href", url);
	for(var i=0; i<graphType.length; i++)
	{
		var g = graphType[i];
	 	var graphPrev = $(".graph_preview").clone();
		graphPrev.removeClass("template graph_preview");
		graphPrev.find(".graph_preview_name").text(g.name);
		graphPrev.find(".graph_preview_image").attr("src","/html/img/"+g.type+".png");
		myDashboard.find(".graph_prev").append(graphPrev);
	}



    //mod victor
    myDashboard.find(".delete_dashboard_button").click({id:dashboardid},function(evt) {
        var dashboardId=evt.data.id;
        $.post("/delete_dashboard",{id:dashboardid}, function(response, textStatus){
            if(response.status == "done")
            {
                myDashboard.remove();
            }
        });
    });

    myDashboard.find(".rename_dashboard_button").click({name:name,id:dashboardid},function(evt) {
        var id=evt.data.id;
        var name=evt.data.name;
        $(".rename_dashboard").foundation("reveal", "open");
        $("#rename_dashboard_name").val(name);
        $("#rename_dashboard_id").val(id);
    });

    myDashboard.find(".dashboard_id").val(dashboardid);
    //

	$("#dashboard_list").append(myDashboard);
	$("#dashboard_list").append("<hr/>");

}

function getGraphs(dashboard)
{
    //alert(JSON.stringify(dashboard));
	var dashboardId = dashboard.id;
	$.post("/get_dash_graph_button", {"dashboardid":dashboardId, dashboarduuid:dashboard.uuid}, function(response,textStatus){
		if(response.status == "done")
		{
			var graphs = response.graphs;
			var buttons = response.buttons;
			var graphsPreview = [];
			var i=0;
			while ((i<graphs.length) && (graphsPreview.length<4))
			{
				graphsPreview.push(graphs[i]);
				i++;
			}
            //alert(dashboardId)
			addDashboard(dashboard.name, dashboardId, buttons, graphs, graphsPreview);
		}
});
}