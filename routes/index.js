var express = require('express');
var database = require('../database.js');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//module.exports = router;

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
	database.addDashboard(name, description, function(err){
		console.log(err);
		if(err)
			res.status(500).send({"status":"error"});
		else
			res.status(200).send({"status":"done"});
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
			res.status(200).send(graphs);
		else
			res.status(500).send({status:"error"});
	});
}

function addGraph(req, res)
{
	var body = req.body;
	database.addGraph(body.name, body.description, body.unit, body.dashboardid,function(err){
		if(!err)
			res.status(200).send({status:"done"});
		else
			res.status(500).send({status:"error"});
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
			res.status(200).send(signals);
		}
		else
			res.status(500).send({status:"error"});
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
	database.getSignalValueInInterval(body.id, body.min, body.max, function(err, values){
		if(!err)
			res.status(200).send(values);
		else
			res.status(500).send({status:"error"});
	});
}

module.exports=function(app)
{
	app.post("/get_hboards",getDasboards);
	app.post("/get_dash_graph", getGraphs);
	app.post("/get_graph_signals", getSignals);
	app.post("/add_dashboard", addDashboard);
	app.post("/delete_dashboard", deleteDashboard);
	app.post("/add_graph",addGraph);
	app.post("/add_signal", addSignal);
	app.post("/remove_signal", removeSignal);
	app.post("/add_signal_value", addSignalValue);
	app.post("/get_latest_signal", getLatestSignal);
	app.post("/get_signal_value", getSignalValue);
}
