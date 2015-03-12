var lastDatetime=0;
var globalGraphs=new Array();

// function createSeries(signals,graphType){
//     var series=new Array();
//     for(var index=0;index<signals.length;index++){
//         if(graphType=='line')
//             series.push({
//                 name: signals[index].signalName,
//                 shadow: true,
//                 tooptip: {
//                     valueDecimals: 2
//                 },
//                 data: [1,5,2,3,4,5,5]
//             });
//         else if(graphType=='stepline')
//             series.push({
//                 name: signals[index].signalName,
//                 shadow: true,
//                 tooptip: {
//                     valueDecimals: 2
//                 },
//                 step: true,
//                 data: [1,5,2,3,4,5,5]
//             });
//         else if(graphType=='spline')
//             series.push({
//                 name: signals[index].signalName,
//                 shadow: true,
//                 tooptip: {
//                     valueDecimals: 2
//                 },
//                 type:'spline',
//                 data: [1,5,2,3,4,5,5]
//             });
//         else if(graphType=='point'){
//             series.push({
//                 name: signals[index].signalName,
//                 shadow: true,
//                 tooptip: {
//                     valueDecimals: 2
//                 },
//                 lineWidth: 0,
//                 marker : {
//                     enabled : true,
//                     radius : 2
//                 },
//                 data: [1,5,2,3,4,5,3]
//             });
//         }
//     }
//     return series;
// }

function addLine(graph,container,lastValueContainer){

    /*$(function () {
        $.getJSON('http://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
            alert(JSON.stringify(data));
        });
    });*/

    /*for(var graphIndex=0;graphIndex<graphs.length;graphIndex++) {
        globalGraphs.push(graphs[graphIndex]);
    }*/
    var a=new myGraph();

    // var series=createSeries(graph.graphSignals,graph.graphType);

    //a.setSeries(series);
    a.setGraph(graph);
    a.setSignals(graph.graphSignals);
    a.createSeries();
    a.setContainer(container);
    a.drawGraph();

    globalGraphs.push(a);

    /*var myLineWidget=new MyLineWidget();
    myLineWidget.randomData();
    myLineWidget.draw(1);*/

    /*container.highcharts('StockChart',
        {
            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'AAPL Stock Price'
            },

            series: series
        }
    );*/

    //lastValueContainer.text(series[0].data[series[0].data.length-1]);
}

function addSpeedometer(graph, signals, latestValueContainer, container) {
    var signal = signals[0].id;
    var vals = [];
    container.highcharts({
            chart: {type: 'gauge'},
            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
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
                title: {text: graph.unit},
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
            title: "none",
            series: [{
                data: [],
                tooltip: {valueSuffix: graph.unit}
            }]

        },
        function (chart) {
           /* var refresh = function () {
                if (vals.length > 0)
                    getLatestValues(signal, vals[vals.length - 1].ts, function (v) {
                        for (var i = 0; i < v.length; i++) {
                            vals.push(v[i]);
                            if (chart.series[0].points[0])
                                chart.series[0].points[0].update(v[i].value, true);
                            else
                                chart.series[0].addPoint(v[i].value, true);
                        }
                        if (v.length > 0)
                            latestValueContainer.text(v[v.length - 1].value + " " + graph.unit);
                        setTimeout(refresh, 1000);
                    });
                else
                    getValues(signal, function (v) {
                        for (var i = 0; i < v.length; i++) {
                            vals.push(v[i]);
                            if (chart.series[0].points[0])
                                chart.series[0].points[0].update(v[i].value, true);
                            else
                                chart.series[0].addPoint(v[i].value, true);
                        }
                        if (v.length > 0)
                            latestValueContainer.text(v[v.length - 1].value + " " + graph.unit);
                        setTimeout(refresh, 1000);
                    });
            };

            refresh();*/
        });

}

$(document).ready(function () {
    var url = window.location.pathname;
    var dashboardId = url.substring("/dashboard/".length);

    $("#cancel_add_sensor").click(function () {
        $(".add_sensor").foundation("reveal", "close");
    });

    $("#cancel_add_button").click(function () {
        $(".add_button").foundation("reveal", "close");
    });

    //rename dashboard popup
    $(".rename_dashboard_button").click(function () {
        var dashboardId=url.substring("/dashboard/".length);
        var dashboardName=$("#my_dashboard_name").html();
        $(".rename_dashboard").foundation("reveal", "open");
        $("#rename_dashboard_name").val(dashboardName);
        $("#rename_dashboard_id").val(dashboardId);
    });

    //rename the dashboard
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
                    $("#my_dashboard_name").html(name);
                }
            });
        }
    });

    //cancel dashboard renamal
    $("#cancel_rename_dashboard").click(function(){
        $(".rename_dashboard").foundation("reveal", "close");
    });

    //delete dashboard
    /*$('.delete_dashboard_button').click(function(){
        var dashboardId=url.substring("/dashboard/".length);
        $.post("/delete_dashboard",{id:dashboardId}, function(response, textStatus){
            if(response.status == "done")
            {
                window.location="/dashboards";
            }
        });

    });*/

    //to do: rename to ok_add_graph
    $("#ok_add_sensor").click(function () {
        var graphName = $("#add_sensor_name").val();
        var graphDescription = $("#add_sensor_description").val();
        var graphUnit = $("#add_sensor_unit").val();
        var graphType = $("#add_sensor_graph").val();
        var signalName = $("#add_signal_name").val();
        var dashboardUuid = $("#key").html();

        if (graphName.length == 0 || signalName.length == 0) {
            alert("Sensor name or signal name cannot be empty");
            return;
        }

        //if the input is correct close the dialog
        $(".add_sensor").foundation("reveal", "close");

        $.post("/add_graph_and_signal",
            {
                graphName: graphName,
                graphDescription: graphDescription,
                graphUnit: graphUnit,
                graphType: graphType,
                signalName: signalName,
                dashboardId: dashboardId,
                dashboardUuid: dashboardUuid
            },
            function (response, textStatus) {
                if (response.status != "done") {
                    alert(textStatus);
                    return;
                }

                var graphName = $("#add_sensor_name").val("");
                var graphDescription = $("#add_sensor_description").val("");
                var graphUnit = $("#add_sensor_unit").val();
                var graphType = $("#add_sensor_graph").val();
                var signalName = $("#add_signal_name").val("");

                var signal= {
                    signalId: response.signalId,
                    signalName: signalName,
                    signalValues: [],
                    signalDatetime: 1,
                    dashboardUUID: dashboardUuid
                };

                var graph = {
                    graphId: response.graphId,
                    graphName: graphName,
                    graphDescription: graphDescription,
                    graphType: graphType,
                    graphUnit: graphUnit,
                    dashboardId: dashboardId,
                    graphSignals: [signal]
                };

                addGraphAndSignal(graph);
            }
        );

    });
    
    $("#ok_add_button").click(function () {
        var buttonName=$("#add_button_name").val();
        var buttonDescription=$("#add_button_description").val();
        var buttonType=$("input:radio[name=btntype]:checked").val();
        var dashboardUUID = $("#key").html();

        if (buttonName.length == 0 || buttonDescription.length == 0) {
            alert("Button name or button description cannot be empty");
            return;
        }

        //if the input is correct close the dialog
        $(".add_button").foundation("reveal", "close");

        $.post("/add_button",
            {
                buttonName:buttonName,
                buttonDescription:buttonDescription,
                buttonType:buttonType,
                dashboardUUID:dashboardUUID
            },
            function(response, textStatus){
                if (response.status != "done") {
                    alert(textStatus);
                    return;
                }

                var button={
                    buttonId:response.buttonId,
                    buttonName:buttonName,
                    buttonDescription:buttonDescription,
                    buttonType:buttonType,
                    buttonValue:1,
                    dashboardUUID:dashboardUUID
                };
                addButton(button);
            }
        );
    });

    $.post("/get_dashboard", {dashboardId: dashboardId}, function (dashboard, textStatus) {
        $("#my_dashboard_name").text(dashboard.name);
        $("#key").text(dashboard.uuid);
        $("#dashboard_description").text(dashboard.description);

        $.post("/get_dashboard_graphs_and_buttons", {
            dashboardid: dashboard.id,
            dashboarduuid: dashboard.uuid
        }, function (result, textStatus) {
            if (result.status == "done") {

                var graphs = result.graphs;
                var buttons = result.buttons;

                $("#sensor_count").text(graphs.length);
                $("#button_count").text(buttons.length);
                $("#board_count").text("-");

                for (var i = 0; i < buttons.length; i++) {
                    var b = buttons[i];
                    addButton(b);
                }
                for (var i = 0; i < graphs.length; i++) {
                    var s = graphs[i];
                    addGraphAndSignal(graphs[i]);
                }

                setInterval(function(){
                    var signalsInfos=new Array();
                    var contains=false;
                    for(var graphIndex=0;graphIndex<globalGraphs.length;graphIndex++)
                        for(var signalIndex=0;signalIndex<globalGraphs[graphIndex].graph.graphSignals.length;signalIndex++) {
                            contains=false;
                            for (var signalInfoIndex = 0; signalInfoIndex < signalsInfos.length; signalInfoIndex++)
                                if (signalsInfos[signalInfoIndex].signalId == globalGraphs[graphIndex].graph.graphSignals[signalIndex].signalId)
                                    contains=true;
                            if(!contains)
                                signalsInfos.push({
                                    signalId:globalGraphs[graphIndex].graph.graphSignals[signalIndex].signalId,
                                    signalDatetime:globalGraphs[graphIndex].graph.graphSignals[signalIndex].signalDatetime
                                });
                        }
                    //console.log(signalsInfos);

                    $.post("/get_signals_values",{signalsInfos:signalsInfos},function(response){
                        if(response.status=="done"){
                            for(var graphIndex=0;graphIndex<globalGraphs.length;graphIndex++)
                                globalGraphs[graphIndex].addSignalsValues(response.value);
                        }
                    })
                },1000);
            }
        });
    });

});

function refresh(){

}

function addButton(button) {

    var myButton;
    if (button.buttonType == "slider") {
        myButton = $(".button_slide").clone();
        myButton.removeClass("template button_slide");

        myButton.foundation('slider', 'set_value', button.buttonValue);

       // myButton.find(".slider_id").attr("id", "sliderOutput" + button.buttonId);
       // myButton.find(".slider_options").attr("data-options", "display-selector:# sliderOutput" + button.id + ";");
        /*myButton.on('change.fndtn.slider', function () {
//
        });*/
    }
    else if(button.buttonType == "switch") {
        myButton = $(".button_check").clone();
        myButton.removeClass("template button_check");


    }
    //setChecked.attr("id", button.id);
    myButton.find(".button_name").text(button.buttonName);
    $("#button_area").append(myButton);

    /*if (button.type == "slider") {
        = $(".button_slide").clone();
        myButton.removeClass("template button_slide");
        myButton.foundation('slider', 'set_value', button.value);
        $("#button_area").append(myButton);
        myButton.find(".button_name").text(button.name);
        myButton.find(".slider_id").attr("id", "sliderOutput" + button.id);
        myButton.find(".slider_options").attr("data-options", "display-selector:# sliderOutput" + button.id + ";");
        myButton.on('change.fndtn.slider', function () {
            $.post("/update_button", {value: myButton.find(".range-slider").attr('data-slider'), id: button.id},
                function (result, textStatus) {
                    //TODO-make efficient, less requests
                });
        });

    }
    else if (button.type == "switch") {
        var value = button.value;
        var myButton = $(".button_check").clone();
        var setChecked = myButton.find(".set_checked");
        myButton.removeClass("template button_check");
        setChecked.attr("id", button.id);
        myButton.find(".l_set_ckecked").attr("for", button.id);
        if (button.value == 1)
            setChecked.attr("checked", '');
        $("#button_area").append(myButton);
        myButton.find(".button_name").text(button.name);
        setChecked.click(function () {
            value = 1 - value;
            $.post("/update_button", {value: value, id: button.id},
                function (result, textStatus) {
                    //TODO-make efficient, less requests
                });
        });
    }*/

    /*$('[data-slider]').on('change.fndtn.slider', function(event){
        // do something when the value changes
        alert(this);
    });*/
}

function addGraphAndSignal(graph) {
    //create the sensor hdhml after the template
    var mySensor = $(".chart_template").clone();
    //remove the template class
    mySensor.removeClass("template chart_template");
    //set the sensor name
    mySensor.find(".widget_name").text(graph.graphName);

    //append the sensor html to the sensors area
    $("#sensor_area").append(mySensor);

    //add onclick action on the sensor
    //@ to do : rename the delete button to delete_graph_button
    mySensor.find(".delete_chart_button").click({graphId: graph.graphId}, function (evt) {
        var graphId = evt.data.graphId;
        $.post("/remove_graph", {graphId: graphId}, function (response, textStatus) {
            if (response.status == "done") {
                mySensor.remove();
            }
        });
    });

    // if(graph.graphType=="line" || graph.graphType=="stepline" || graph.graphType=="spline" || graph.graphType=="point")
    //     addLine(graph,mySensor.find(".chart"),mySensor.find(".latest_value"));
    // else if(graph.graphType == "speedometer")
    //     addSpeedometer(graph, signals, mySensor.find(".latest_value"), mySensor.find('.chart'));

    if (graph.graphType == "line")
    {
        var line = new MyLineWidget ();
        line.name = graph.graphName;
        line.description = graph.graphDescription;
        graph.graphSignals.forEach (function (signal)
        {
            console.log (signal);
            line.addSignal ({name:signal.signalName, color:"#000000"});
        });
        globalGraphs.push (line);
    }
}

