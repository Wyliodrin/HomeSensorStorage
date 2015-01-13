"use strict"

var config = require('./config.js').data;
var mysql = require('mysql');
var uuid = require('node-uuid');

var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

var dashboardTable = config.prefix+"dashboard";
var graphTable = config.prefix+"graph";

connection.connect();

function parseName(name)
{
	name = name.toLowerCase();
	for(var i=0; i<name.length; i++)
	{
		var c = name.charAt(i);
		if(!((c>='a' && c<='z') || c=='_' || (c>='0' && c<='9')))
		{
			name = name.substring(0,i)+'_'+name.substring(i+1);
		}  
	}
	return name;
}

function addDashboard(name, description,callbackFunction)
{
	name = parseName(name);
	var uid = uuid.v4();
	for(var i=0; i<uid.length; i++)
	{
		var c = uid.charAt(i);
		if(!((c>='a' && c<='z') || (c>='0' && c<='9')))
		{
			uid =  uid.slice(0, i) + uid.slice(i+1);
		}
	}
	var query = "insert into "+dashboardTable+" (name, description, uuid) values ("+mysql.escape(name)+
				", "+mysql.escape(description)+", "+mysql.escape(uid)+");";
console.log(query);
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to database "+err);
		callbackFunction(err);
	});
}

addDashboard("my_dash",null, function(err){
	addGraph("my_graph","alabalaportocala","celsius","3f0ff286b5ba4238976c715c4cf598c2",function(err){});
});

function addGraph(name, description, unit, dashboard, callbackFunction)
{
	name = parseName(name);
	var signalTable = config.prefix+dashboard+name;
	var query = "insert into "+graphTable+" (name, description, unit, dashboard) values ("+mysql.escape(name)+
				", "+mysql.escape(description)+", "+mysql.escape(unit)+", "+mysql.escape(dashboard)+");";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to database "+err);
		// else
		// {
		// 	// query = "create table "+signalTable+" (timestamp TIMESTAMP(3) NOT NULL, value DOUBLE NOT NULL, PRIMARY KEY(timestamp));";
		// 	// connection.query(query, function(err, rows){
		// 	// 	if(err)
		// 	// 		console.log("Could not add entry to database "+err);
		// 	// });
		// }
		callbackFunction(err);
	});
}

function addSignal(timestamp, value, dashboard, callbackFunction)
{
	var dataName = config.prefix+dashboard+graph;
	var query = "insert into "+dataName+" (timestamp, value) values (from_unixtime("+timestamp+"), "+
				mysql.escape(value)+");";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to database "+err);
		callbackFunction(err);
	});
}

function deleteDashboard(dashboardId, callbackFunction)
{
	var dashboardTable = config.prefix + 'dashboard';
	var signalsTable = config.prefix+mysql.escape(dashboardId);
	var query = "delete from "+dashboardTable+" where id = "+mysql.escape(dashboardId)+";";
	var tables = "";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not delete dasboard");
		else
		{
			query = "show tables;";
			connection.query(query, function(err, rows){
				if(!err)
				{
					for(var i=0; i<rows.length; i++)
					{
						var row = rows[i]['Tables_in_'+config.database];
						if(row.substring(0,signalsTable.length) == signalsTable)
						{
							tables = tables+row+", ";
						}
					}
					tables = tables.substring(0,tables.length-2);
					query = "drop table if exists "+tables+";";
					connection.query(query, function(err){
						callbackFunction(err);
					});
				}
			})
		}
	});
}

function deleteGraphFromDashboard(graphId, dashboardId, callbackFunction)
{
	var graphTable = config.prefix+'graph';
	getGraphName(graphId, function(err, name){
		if(!err && name)
		{
			var signalsTable = config.prefix+mysql.escape(dashboardId)+name;
			var query = "delete from "+graphTable+" where id = "+graphId+";";
			connection.query(query, function(err, rows){
				if(!err)
				{
					query = "drop table if exists "+signalsTable+";";
					connection.query(query,function(err, rows){
						callbackFunction(err);
					});
				}
				else
				{
					console.log("Could not delete graph");
					callbackFunction(err);
				}
			});
		}
		else
		{
			console.log("Graph does not exist");
			callbackFunction(-1);
		}
	});
}

function getGraphName(graphId, callbackFunction)
{
	var graphTable = config.prefix+'graph';
	var query = "select name from "+graphTable+" where id = "+mysql.escape(graphId)+";";
	connection.query(query, function(err,rows){
		if(!err && rows.length>0)
		{
			callbackFunction(null,rows[0].name);
		}
		else
			callbackFunction(err, null);
	})
}



// addSignal(1196440219,12,'g', 2, function(err){
// 	console.log(err);
// });

//deleteDashboard(1, function(err){});
