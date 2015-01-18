function addMyLine(graph, signals, latestValueContainer, container)
{
    var signal = signals[0].id;
    console.log(signal);
    var vals = [];
    container.highcharts('StockChart',
    {
        subtitle: {text: graph.description},    
        yAxis:{
                    min: -10,
                    max: 100
               },
        series: [{data:[]}]
    }, 

    function(chart){
        var refresh = function(){
            if(vals.length>0)
                getLatestValues(signal,vals[vals.length-1].ts,function(v){
                    for(var i=0; i<v.length; i++)
                    {
                        vals.push(v[i]);
                        chart.series[0].addPoint([v[i].ts, v[i].value], true);
                    }
                    if(v.length > 0)
                        latestValueContainer.text(v[v.length-1].value+" "+graph.unit);
                    setTimeout(refresh,1000);
                });
            else
                getValues(signal,function(v){
                    for(var i=0; i<v.length; i++)
                    {
                        vals.push(v[i]);
                        chart.series[0].addPoint([v[i].ts, v[i].value], true);
                    }
                    if(v.length > 0)
                        latestValueContainer.text(v[v.length-1].value+" "+graph.unit);
                    setTimeout(refresh,1000);
                });
        };

        refresh();
    });
}

function addStepLine(graph, signals, latestValueContainer, container)
{
    var signal = signals[0].id;
    var vals = [];
    container.highcharts('StockChart',
    {
        subtitle: {text: graph.description},    
        yAxis:{
                    min: -10,
                    max: 100
               },
        series: [{data:[], step:true}]
    }, 

    function(chart){
        var refresh = function(){
            if(vals.length>0)
                getLatestValues(signal,vals[vals.length-1].ts,function(v){
                    for(var i=0; i<v.length; i++)
                    {
                        vals.push(v[i]);
                        chart.series[0].addPoint([v[i].ts, v[i].value], true);
                    }
                    if(v.length > 0)
                        latestValueContainer.text(v[v.length-1].value+" "+graph.unit);
                    setTimeout(refresh,1000);
                });
            else
                getValues(signal,function(v){
                    for(var i=0; i<v.length; i++)
                    {
                        vals.push(v[i]);
                        chart.series[0].addPoint([v[i].ts, v[i].value], true);
                    }
                    if(v.length > 0)
                        latestValueContainer.text(v[v.length-1].value+" "+graph.unit);
                    setTimeout(refresh,1000);
                });
        };

        refresh();
    });
}

function addSpeedometer(graph, signals, latestValueContainer, container)
{
    var signal = signals[0].id;
    var vals = [];
    container.highcharts({
        chart: {type: 'gauge'},
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
            min: -10,
            max: 40,

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
            subtitle: {text: graph.description}, 
            title:{text:graph.unit},
            plotBands: [{
                from: -10,
                to: 5,
                color: '#55BF3B' // green
            }, {
                from: 5,
                to: 20,
                color: '#DDDF0D' // yellow
            }, {
                from: 20,
                to: 40,
                color: '#DF5353' // red
            }]
        },
        title:"none",
        series: [{
            data: [],
            tooltip: {valueSuffix: graph.unit }
        }]

    },
        function(chart){
        var refresh = function(){
            if(vals.length>0)
                getLatestValues(signal,vals[vals.length-1].ts,function(v){
                    for(var i=0; i<v.length; i++)
                    {
                        vals.push(v[i]);
                        if(chart.series[0].points[0])
                            chart.series[0].points[0].update(v[i].value, true);
                        else
                            chart.series[0].addPoint(v[i].value, true);
                    }
                    if(v.length > 0)
                        latestValueContainer.text(v[v.length-1].value+" "+graph.unit);
                    setTimeout(refresh,1000);
                });
            else
                getValues(signal,function(v){
                    for(var i=0; i<v.length; i++)
                    {
                        vals.push(v[i]);
                       if(chart.series[0].points[0])
                            chart.series[0].points[0].update(v[i].value, true);
                        else
                            chart.series[0].addPoint(v[i].value, true);
                    }
                    if(v.length > 0)
                        latestValueContainer.text(v[v.length-1].value+" "+graph.unit);
                    setTimeout(refresh,1000);
                });
        };

        refresh();
    });
               
}

$(document).ready(function()
{
    var url = window.location.pathname;
    var dashboardid = url.substring("/dashboard/".length);

    $("#cancel_add_sensor").click(function(){
        $(".add_sensor").foundation("reveal", "close");
    });

    $("#cancel_add_button").click(function(){
        $(".add_button").foundation("reveal", "close");
    });
 	
 	$.post("/get_dashboard",{id:dashboardid},function(dash, textStatus){
     	$("#my_dashboard_name").text(dash.name);
     	$("#key").text(dash.uuid);
     	$("#dashboard_description").text(dash.description);

        $("#ok_add_button").click(function(){
            $(".add_button").foundation("reveal", "close");
            var name = $("#add_button_name").val();
            console.log(name);
            if(name.length > 0)
            {   
                var type = $("input:radio[name=btntype]:checked").val();
                var description = $("#add_button_description").val();
                $.post("/add_button",{dashboarduuid:dash.uuid,type:type,name:name,value:0},function(result, textStatus){
                    //
                });
            }            
        });

     	$.post("/get_dash_graph",{dashboardid:dash.id},function(result, textStatus){
            if(result.status == "done")
            {
                var buttons=[];
                var sensors=[];
                var graphs = result.graphs;
                for(var i=0; i<graphs.length; i++)
                {
                    var g = graphs[i];
                    if((g.type == "button_check") || (g.type == "button_slide"))
                        buttons.push(g);
                    else
                        sensors.push(g);
                }
                $("#sensor_count").text(sensors.length);
                $("#button_count").text(buttons.length);
                $("#board_count").text("-");
                for(var i=0; i<buttons.length; i++)
                {
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
                    getGraphSignals(s);
                }
                $("#ok_add_sensor").click(function(){
                $(".add_sensor").foundation("reveal", "close");
                var name = $("#add_sensor_name").val();
                var signal = $("#add_signal_name").val();
                if((name.length > 0) && (signal.length > 0))
                {
                    var description = $("#add_sensor_description").val();
                    var unit = $('#select_unit').val();
                    var graphType = $('#select_graph_type').val();
                    $.post("/add_graph",
                    {name:name, description:description, unit:unit, type:graphType, dashboardid:dashboardid, signalName:signal, dashboarduuid:dash.uuid},
                    function(response, textStatus){
                        if(response.status == "done")
                        {
                            var sensor = {id:response.graphid, name:name, type:graphType, unit:unit, description:description, dashboard:dashboardid};
                            addGraph(sensor,[[]]);
                            sensors.push(sensor);
                            $("#sensor_count").text(sensors.length);
                        }
                    });
                }
            });
            }
        });
     });
});

function addGraph(graph, signals)
{
    var mySensor = $(".chart_template").clone();
    mySensor.removeClass("template chart_template");
    $("#sensor_area").append(mySensor);
    //getLatestValue(s,mySensor.find(".latest_value"));
    mySensor.find(".widget_name").text(graph.name);
    if(graph.type == "line")
        addMyLine(graph, signals, mySensor.find(".latest_value"), mySensor.find(".chart"));
    else if(graph.type == "stepline")
        addStepLine(graph, signals, mySensor.find(".latest_value"), mySensor.find(".chart"));
    else if(graph.type == "speedometer")
        addSpeedometer(graph, signals, mySensor.find(".latest_value"), mySensor.find('.chart'));
}

function getGraphSignals(s)
{
     $.post("/get_graph_signals", {graphid:s.id}, function(result, textStatus){
                        if(result.status == "done")
                        {
                            addGraph(s,result.signals);
                        }
                    });
}

function getLatestValues(signalid,lastValue, callbackFunction)
{
    $.post("/get_signal_values_interval",{id:signalid, min:lastValue},function(val,textStatus){
        callbackFunction(val);
        
    });
}

function getValues(signalid,callbackFunction)
{
    $.post("/get_signal_value",{id:signalid},function(val,textStatus){
        callbackFunction(val);
    });
}

