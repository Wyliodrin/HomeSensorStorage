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

    $("#ok_edit_sensor").click(function(){
        $(".edit_sensor_description").foundation("reveal","close");
        var graphId=$("#edit_sensor_graph_id").val();
        var graphName=$("#edit_sensor_name").html();
        var graphDescription=$("#edit_sensor_description").val();

        for(var index=0;index<globalGraphs.length;index++)
            if(globalGraphs[index].name==graphName)
                globalGraphs[index].setDescription(graphDescription);

        $.post("/set_sensor_description",
            {graphId:graphId,sensorDescription:graphDescription},
            function(response, textStatus){
                //alert(JSON.stringify(response));
            }
        );
    });

    $("#cancel_edit_sensor").click(function(){
        $(".edit_sensor_description").foundation("reveal","close");
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
                    alert(response);
                    return;
                }

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

                setTimeout(function(){refresh();},1000);
            }
        });
    });

});

var globalGraphs=new Array();

function refresh(){
    var signalsInfos=new Array();
    var contains=false;
    var signals = dictionary ();
    for(var graphIndex=0;graphIndex<globalGraphs.length;graphIndex++)
    {
        _.each (globalGraphs[graphIndex].signals, function (signal)
        {
            console.log (signal);
            signals.set (signal.id+"", signal);
        });
    }
    signals.forEach (function (s)
    {
        //console.log (s.name);
        signalsInfos.push ({signalId: s.id, signalName: s.name, signalDatetime:s.ts});
    });

    $.post("/get_signals_values",{signalsInfos:signalsInfos},function(response){
        if(response.status=="done"){
            for(var graphIndex=0;graphIndex<globalGraphs.length;graphIndex++)
                for (var signalIndex = 0; signalIndex < response.value.length; signalIndex++)
                {
                    if (globalGraphs[graphIndex].signalNr (response.value[signalIndex].signalName)>=0)
                    { for (var valueIndex = 0; valueIndex < response.value[signalIndex].signalValues.length; valueIndex++)
                            globalGraphs[graphIndex].addValueToSignal (response.value[signalIndex].signalName, response.value[signalIndex].signalValues[valueIndex][1], response.value[signalIndex].signalValues[valueIndex][0]);
                        globalGraphs[graphIndex].update ();
                    }
                }
            setTimeout(function(){refresh();},1000);
        }
    })
}

function addButton(button) {

    var myButton;
    if (button.buttonType == "slider") {
        myButton = $(".button_slide").clone();
        myButton.removeClass("template button_slide");
        myButton.attr("id","switch-"+button.buttonId);

        myButton.find(".slider_id").attr("id", "slider" + button.buttonId);
        myButton.find(".slider_options").attr("data-options", "display_selector: #slider" + button.buttonId);

        myButton.find(".slider_id").html(button.buttonValue);
        myButton.find(".slider_options").attr("data-slider",button.buttonValue);

        myButton.on('change.fndtn.slider', function (buttonId) {
                var mySliderValue=$("#switch-"+buttonId).find(".range-slider").attr('data-slider');
                $.post("/set_button_value",{buttonId:button.buttonId,buttonValue:mySliderValue},
                     function(response,textStatus){
                        //alert(JSON.stringify(response));
                     }
                 );
        }.bind(null,button.buttonId));
    }
    else if(button.buttonType == "switch") {
        myButton = $(".button_check").clone();
        myButton.removeClass("template button_check");
        myButton.find("#exampleCheckboxSwitch").attr("id","switch"+button.buttonId);
        myButton.find(".l_set_ckecked").attr("for","switch"+button.buttonId);

        myButton.find("#switch"+button.buttonId).prop("checked",true);

        myButton.find(".set_checked").click(function(buttonId){
            var buttonValue=$("#switch"+button.buttonId).is(":checked");
            if(buttonValue==true)
                buttonValue=1;
            else
                buttonValue=0;
            $.post("/set_button_value",{buttonId:buttonId,buttonValue:buttonValue},
                function(response,textStatus){
                    //alert(JSON.stringify(response));
                }
            );
        }.bind(null,button.buttonId));
    }
    myButton.find(".button_name").text(button.buttonName);
    $("#button_area").append(myButton);
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

    mySensor.find(".d-settings").attr("data-dropdown","drop"+graph.graphId);
    mySensor.find(".f-dropdown").attr("id","drop"+graph.graphId);

    mySensor.find(".edit_sensor_description_button").click({graphId:graph.graphId,graphName:graph.graphName,signalName:graph.graphSignals[0].signalName,sensorDescription:graph.graphDescription},function(evt){
        var graphId=evt.data.graphId;
        var graphName=evt.data.graphName;
        var signalName=evt.data.signalName;
        var sensorDescription=evt.data.sensorDescription;
        $(".edit_sensor_description").foundation("reveal","open");
        $("#edit_sensor_graph_id").val(graphId);
        $("#edit_sensor_name").html(graphName);
        $("#edit_signal_name").html(signalName);

        for(var index=0;index<globalGraphs.length;index++)
            if(globalGraphs[index].name==graphName)
                $("#edit_sensor_description").val(globalGraphs[index].description);

    });
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

    if (graph.graphType == "line")
    {
        var line = new MyLineWidget ();
        line.name = graph.graphName;
        line.description = graph.graphDescription;
        line.setLatestValueElement(mySensor.find(".latest_value"));
        graph.graphSignals.forEach (function (signal)
        {
            console.log (signal);
            line.addSignal ({id: signal.signalId, name:signal.signalName, color:"#000000", ts: 0});
        });
        line.draw (mySensor.find ('.chart'));
        globalGraphs.push (line);
    }
    else if(graph.graphType=="spline"){
        var spline=new SplineLineWidget();
        spline.name=graph.graphName;
        spline.description=graph.graphDescription;
        spline.setLatestValueElement(mySensor.find(".latest_value"));
        graph.graphSignals.forEach(function(signal){
            console.log (signal);
            spline.addSignal ({id: signal.signalId, name:signal.signalName, color:"#000000", ts: 0});
        });
        spline.draw(mySensor.find(".chart"));
        globalGraphs.push(spline);
    }
    else if(graph.graphType=="stepline"){
        var stepLine=new StepLineWidget();
        stepLine.name=graph.graphName;
        stepLine.description=graph.graphDescription;
        stepLine.setLatestValueElement(mySensor.find(".latest_value"));
        graph.graphSignals.forEach (function (signal)
        {
            console.log (signal);
            stepLine.addSignal ({id: signal.signalId, name:signal.signalName, color:"#000000", ts: 0});
        });
        stepLine.draw (mySensor.find ('.chart'));
        globalGraphs.push (stepLine);
    }
    else if(graph.graphType=="point"){
        var pointMaker=new PointMarkerWidget();
        pointMaker.name=graph.graphName;
        pointMaker.description=graph.graphDescription;
        pointMaker.setLatestValueElement(mySensor.find(".latest_value"));
        graph.graphSignals.forEach (function (signal)
        {
            console.log (signal);
            pointMaker.addSignal ({id: signal.signalId, name:signal.signalName, color:"#000000", ts: 0});
        });
        pointMaker.draw (mySensor.find ('.chart'));
        globalGraphs.push (pointMaker);
    }
    else if(graph.graphType=="speedometer"){
        var spedometer=new SpeedometerWidget();
        spedometer.name=graph.graphName;
        spedometer.description=graph.graphDescription;
        spedometer.setLatestValueElement(mySensor.find(".latest_value"));
        spedometer.addSignal ({id: graph.graphSignals[0].signalId, name:graph.graphSignals[0].signalName, color:"#000000", ts: 0});
        spedometer.draw (mySensor.find ('.chart'));
        globalGraphs.push (spedometer);
    }
    else if(graph.graphType=="custom"){
        var button=new MyImage();
        button.name=graph.graphName;
        button.description=graph.graphDescription;
        button.setLatestValueElement(mySensor.find(".latest_value"));
        button.addSignal ({id: graph.graphSignals[0].signalId, name:graph.graphSignals[0].signalName, color:"#000000", ts: 0});
        button.draw(mySensor.find ('.chart'));
        globalGraphs.push (button);
    }
}

