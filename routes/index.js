var express = require('express');
var database = require('../database.js');
var path = require('path');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//module.exports = router;

var html_dir = path.join(__dirname, '../public/html');

function getDashboard(req, res)
{
	database.getDashboard(req.body.id,function(err, dashboard){
		if(!err)
		{
			res.status(200).send(dashboard);
			console.log(dashboard);
		}
		else
			res.status(500).send([]);
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
		console.log(err);
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

function getGraphs(req, res)
{
	var dashboardid = req.body.dashboardid;
	database.getDashboardGraphs(dashboardid, function(err, graphs){
		if(!err)
		{
			database.getButtons(req.body.dashboarduuid, function(err, buttons){
				console.log(buttons);
				if(!err)
					res.status(200).send({status:"done",buttons:buttons, graphs:graphs});
				else
					res.status(200).send({status:"error"});
			});
		}
		else
			res.status(200).send({status:"error"});
	});
}

function addGraph(req, res)
{
	var body = req.body;
	database.addGraph(body.name, body.description, body.unit, body.type, body.dashboardid,function(err, graphid){
		if(err)
			res.status(200).send({status:"error"});
		else
		{
			console.log("add signal");
			database.addSignal(body.signalName, body.dashboarduuid, graphid, function(err, signalid){
				if(!err)
					res.status(200).send({status:"done", signalid:signalid, graphid:graphid});
				else
					res.status(200).send({status:"error"});
			});
		}		
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

function removeSignal(req, res)
{

}

function getSignals(req, res)
{
	var body = req.body;
	database.getGraphSignals(body.graphid, function(err, signals){
		if(!err)
		{
			res.status(200).send({signals:signals, status:"done"});
		}
		else
			res.status(200).send({status:"error"});
	});
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

function getLatestSignal(req, res)
{
	database.getLatestSignalValue(req.body.id,function(err, value){
		if(!err)
			res.status(200).send({"value":value});
		else
			res.status(500).send({status:"error"});
	});
}

function getSignalValue(req, res)
{
	var body = req.body;
	database.getSignalValues(body.id, function(err, values){
		if(!err)
			res.status(200).send(values);
		else
			res.status(500).send({status:"error"});
	});
}

function loadDashboards(req, res)
{
    res.sendFile(path.join(html_dir, 'index.html'));
}

function listDashboardData(req, res)
{
	res.sendFile(path.join(html_dir, 'dashboard.html'))
}

function getSignalValuesInterval(req,res)
{
	database.getSignalValueInInterval(req.body.id, req.body.min, req.body.max, function(err,values){
		console.log(err);
		console.log (values);
		if(!err)
			res.status(200).send(values);
		else
			res.status(500).send({status:"error"});
	});
}

function addButton(req,res)
{
	console.log("add button");
	database.addButton(req.body.dashboarduuid, req.body.type, req.body.name, req.body.value, function(err, id){
		if(!err)
			res.status(200).send({status:"done", id:id});
		else
			res.status(200).send({status:"error"});
	});

}

// function getButtons(req, res)
// {
// 	database.getButtons(req.body.dashboarduuid, function(err, buttons){
// 		if(!err)
// 			res.status(200).send({status:"done",buttons:buttons});
// 		else
// 			res.status(200).send({status:"error"});
// 	});
// }

function updateButton(req, res)
{
	database.updateButton(req.body.id, req.body.value, function(err){
		if(!err)
			res.status(200).send({status:"done"});
		else
			res.status(200).send({status:"error"});
	});
}

module.exports=function(app)
{
	app.post("/add_button",addButton);
	app.post("/add_dashboard", addDashboard);
	//app.post("/add_signal", addSignal);
	app.post("/add_graph",addGraph);
	//app.post("/get_buttons",getButtons);
	app.post("/get_dashboards",getDasboards);
	app.post("/get_dashboard", getDashboard);
	app.post("/get_dash_graph_button", getGraphs);
	app.post("/get_graph_signals", getSignals);
	app.post("/get_signal_values_interval",getSignalValuesInterval);
	app.post("/delete_dashboard", deleteDashboard);	
	app.post("/remove_signal", removeSignal);
	app.post("/add_signal_value", addSignalValue);
	app.post("/get_latest_signal", getLatestSignal);
	app.post("/get_signal_value", getSignalValue);
	app.get("/dashboards", loadDashboards);
	app.get("/dashboard/:id",listDashboardData);
	app.post("/update_button",updateButton);
}
