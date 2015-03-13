var express = require('express');
var database = require('../database.js');
var path = require('path');
var config = require('../config.js').data;

/* GET home page. */
/*router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

module.exports = router;*/

var html_dir = path.join(__dirname, '../public/html');

function getDashboard(req, res)
{
    var dashboardId=req.body.dashboardId;
	database.getDashboard(dashboardId,function(err, dashboard){
        if(err){
            res.status(500).send([]);
            return;
        }
        res.status(200).send(dashboard);
	});
}

function getDasboards(req, res)
{
	database.getAllDashboards(function(err, dashboards){
		if(!err)
		{
			res.status(200).send(dashboards);
		}
		else
			res.status(500).send([]);
	});
}

function addDashboard(req, res)
{
	var name = req.body.name;
	var description = req.body.description;
	database.addDashboard(name, description, function(err, insertId){
		if(err)
			res.status(200).send({"status":"error"});
		else
			res.status(200).send({"status":"done",id:insertId});
	});
}

function deleteDashboard(req, res)
{
	var id = req.body.id;
	database.deleteDashboard(id, function(err){
		if(err)
			res.status(500).send({status:"error"});
		else
			res.status(200).send({status:"done"});
	});
}

function removeGraph(req,res){
    var graphId=req.body.graphId;
    database.removeGraph(graphId, function(err){
        if(err) {
            res.status(500).send({status: "error"});
            return;
        }
        res.status(200).send({status:"done"});
    });
}

function renameDashboard(req, res){
    var id=req.body.id;
    var name=req.body.name;

    database.renameDashboard(id, name, function(err){
        if(err)
            res.status(500).send({status:"error"});
        else
            res.status(200).send({status:"done"});
    });
}

function getDashboardsGraphsAndButtons(req, res)
{
	var dashboardId = req.body.dashboardid;
    database.getDashboardsGraphsWithSignals(dashboardId, function(err, graphs){
        if(err){
            res.status(200).send({status:"error"});
            return;
        }
        database.getDashboardButtons(req.body.dashboarduuid, function(err, buttons){
            if(!err)
                res.status(200).send({status:"done",buttons:buttons, graphs:graphs});
            else
                res.status(200).send({status:"error"});
        });
    });
	/*database.getDashboardGraphs(dashboardId, function(err, graphs){
        if(err){
            res.status(200).send({status:"error"});
            return;
        }
        database.getDashboardButtons(req.body.dashboarduuid, function(err, buttons){
            if(!err)
                res.status(200).send({status:"done",buttons:buttons, graphs:graphs});
            else
                res.status(200).send({status:"error"});
        });
	});*/
}

/*function addGraphAndSignal(req, res)
{
	var body = req.body;
	database.addGraphAndSignal(body.graphName, body.graphDescription, body.graphUnit, body.sensorGraph, body.dashboardId,function(err, graphid){
		if(err)
			res.status(200).send({status:"error"});

        database.addSignal(body.signalName, body.dashboarduuid, graphid, function(err, signalid){
            if(!err)
                res.status(200).send({status:"done", signalid:signalid, graphid:graphid});
            else
                res.status(200).send({status:"error"});
        });
	});
}*/

function addGraphAndSignal(req,res){
    var body = req.body;
    database.addGraph(body.graphName, body.graphDescription, body.graphUnit, body.graphType, body.dashboardId,function(err, graphId){
        if(err) {
            res.status(200).send({status: "error"});
            return;
        }

        database.addSignal(body.signalName, body.dashboardUuid, graphId, function(err, signalId){
            if(err){
                res.status(200).send({status:"error"});
                return;
            }
            res.status(200).send({status:"done", graphId:graphId, signalId:signalId});
        });
    });
}

function addSignal(req, res)
{
	var body = req.body;
	database.addSignal(body.name, body.dashboarduuid, body.graphid, function(err){
		if(!err)
			res.status(200).send({status:"done"});
		else
			res.status(500).send({status:"error"});
	});
}

function getGraphSignals(req, res)
{
	var body = req.body;
	database.getGraphSignals(body.graphId, function(err, signals){
        if(err) {
            res.status(200).send({status: "error"});
        }
        console.log(signals);
        res.status(200).send({signals:signals, status:"done"});
	});
}
//get dashboard signals
function getDashboardSignals(req,res){
    var body=req.body;
    database.getGraphSignalsForDashBoard(body.dashboardId, null,function (err, signals) {
        if(err)
            res.status(200).send({status:"error"});
        res.status(200).send({signals:signals});
    })
}

function addSignalValue(req, res)
{
	var body = req.body;
	database.addSignalValue(body.timestamp, body.value, body.name, body.dashboarduuid, function(err){
		if(!err)
			res.status(200).send({status:"done"});
		else
			res.status(500).send({status:"error"});
	});
}

function loadDashboards(req, res)
{
    res.sendFile(path.join(html_dir, 'index.html'));
}

function loadLogin(req, res)
{
	res.sendFile(path.join(html_dir, 'login.html'));
}

function listDashboardData(req, res)
{
	res.sendFile(path.join(html_dir, 'dashboard.html'))
}

function getSignalValuesInterval(req,res)
{
	database.getSignalValueInInterval(req.body.id, req.body.min, req.body.max, function(err,values){
		if(!err)
			res.status(200).send(values);
		else
			res.status(500).send({status:"error"});
	});
}

function addButton(req,res)
{
    var buttonName=req.body.buttonName;
    var buttonDescription=req.body.buttonDescription;
    var buttonType=req.body.buttonType;
    var dashboardUUID=req.body.dashboardUUID;
    //dashboarduuid, type, name, value
	database.addButton(dashboardUUID,buttonType, buttonName, 1, function(err, buttonId){
		if(!err)
			res.status(200).send({status:"done", buttonId:buttonId});
		else
			res.status(200).send({status:"error"});
	});

}

function getButtons(req, res)
{
	database.getDashboardButtons(req.body.dashboarduuid, function(err, buttons){
		if(!err)
			res.status(200).send({status:"done",buttons:buttons});
		else
			res.status(200).send({status:"error"});
	});
}

function login(req, res)
{
	var pass = req.body.pass;
	if (pass == config.loginPassword)
		req.session.login=true;
	res.status(200).send({status:"done"});
}

function getButton(req,res)
{
	database.getButton(req.body.dashboarduuid, req.body.name,function(err, value){
		if(!err)
			res.status(200).send({status:"done", value:value.value});
		else
			res.status(200).send({status:"error"});
	});
}

function getSignalsValues(req,res){
    var signalsInfos=req.body.signalsInfos;
    database.getSignalsValues(signalsInfos,function(err,data){
        if(err){
            res.status(200).send({status:"error"});
            return;
        }
        res.status(200).send({status:"done", value:data});
    });
}

function setButtonValue(req, res){
    var buttonId=req.body.buttonId;
    var buttonValue=req.body.buttonValue;
    database.setButtonValue(buttonId,buttonValue, function (err, data) {
        if(err){
            res.status(200).send({status:"error"});
            return;
        }
        res.status(200).send({status:"done", data:data});
    });
}

function setSensorDescription(req,res){
    var graphId=req.body.graphId;
    var graphDescription=req.body.sensorDescription;

    database.setSensorDescription(graphId,graphDescription,function(err,data){
        if(err){
            res.status(200).send({status:"error"});
            return;
        }
        res.status(200).send({status:"done", data:data});
    });
}

module.exports=function(app)
{
	/*app.use(function(req, res, next) {
		var sess = req.session;
		var signalPrefix = "/signal";
		if((req.url === '/login')||(req.url.indexOf(signalPrefix) == 0))
		{
			next();
		}
		else if(sess.login)
			next();
		else
			res.redirect('/login');	  
	});
	app.get('/login',loadLogin);*/
	/*app.post("/add_button",addButton);
	app.post("/add_dashboard", addDashboard);
	//app.post("/add_signal", addSignal);
	//app.post("/add_graph",addGraphAndSignal);
	//app.post("/signal/get_buttons",getDashboardButtons);
	app.post("/signal/get_button", getButton);
	app.post("/signal/add_signal_value", addSignalValue);
	app.post("/get_dashboards",getDasboards);
	app.post("/get_dashboard", getDashboard);
	//app.post("/get_dash_graph_button", getDashboardsGraphsAndButtons);
	app.post("/get_graph_signals", getGraphSignals);
	app.post("/get_signal_values_interval",getSignalValuesInterval);

    //mod victor
    app.post("/add_graph_and_signal",addGraphAndSignal);
    app.post("/rename_dashboard", renameDashboard);
    app.post("/remove_graph", removeGraph);

    app.post("/get_dashboard_signals",getDashboardSignals);
    app.post("/get_dashboard_graphs_and_buttons",getDashboardsGraphsAndButtons);

    app.post("/get_signals_values",getSignalsValues);*/

    app.post("/login",login);

    app.put("/add_signal",addSignal);app.post("/add_signal", addSignal);

    app.post("/add_dashboard", addDashboard);
    app.post("/add_button",addButton);

    app.get("/dashboard/:id",listDashboardData);
    app.get("/dashboards", loadDashboards);

    app.post("/add_graph_and_signal",addGraphAndSignal);

    app.post("/get_dashboard", getDashboard);
    app.post("/get_dashboards", getDasboards);
    app.post("/get_dashboard_graphs_and_buttons",getDashboardsGraphsAndButtons);
    app.post("/get_signals_values", getSignalsValues);

    app.post("/get_dash_graph_button", getDashboardsGraphsAndButtons);

    app.post("/set_button_value",setButtonValue);
    app.post("/set_sensor_description",setSensorDescription);

    app.post("/remove_graph", removeGraph);

    app.post("/delete_dashboard", deleteDashboard);
}
