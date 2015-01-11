"use strict"

var config = require('./config.js').data;
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database	: config.database
});

var dashboardName = config.prefix+"dashboard";
var graphName = config.prefix+"graph";

connection.connect();


function addDashboard(name, description)
{
	var query = "insert into "+dashboardName+" (name, description) values ("+mysql.escape(name)+
				", "+mysql.escape(description)+");";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to database "+err);
	});
}

function addGraph(name, description, unit, dashboard, fnct)
{
	var query = "insert into "+graphName+" (name, description, unit, dashboard) values ("+mysql.escape(name)+
				", "+mysql.escape(description)+", "+mysql.escape(unit)+", "+mysql.escape(dashboard)+");";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to database "+err);
		else
		{
			var dataName = config.prefix+dashboard+name;
			query = "create table "+dataName+" (timestamp TIMESTAMP NOT NULL, value DOUBLE NOT NULL, PRIMARY KEY(timestamp));";
			connection.query(query, function(err, rows){
				if(err)
					console.log("Could not add entry to database "+err);
			});
		}
		fnct(err);
	});
}

function addSignal(timestamp, value, graph, dashboard)
{
	var dataName = config.prefix+dashboard+graph;
	var query = "insert into "+dataName+" (timestamp, value) values ("+timestamp+", "+
				mysql.escape(value)+");";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to database "+err);
	});
}
addGraph("g",null,"celsius",2, function(err){
	addSignal(1234,12,'g', 2);
});
