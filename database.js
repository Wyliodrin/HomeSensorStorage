"use strict"

var config = require('./config.js').data;
var mysql = require('mysql');
var uuid = require('node-uuid');
var _ = require('underscore');

var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

var dashboardTable = config.prefix+"dashboard";
var graphTable = config.prefix+"graph";
var signalTable = config.prefix+'signal';
var correspondenceTable = config.prefix+'correspondence';
var signalTablePrefix = config.prefix+'signalvalue';

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
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to dashboard database "+err);
		callbackFunction(err);
	});
}

function addGraph(name, description, unit, dashboard, callbackFunction)
{connection.query(query, function(err){connection.query(query, function(err){
						callbackFunction(err);
					});
						callbackFunction(err);
					});
	name = parseName(name);
	var query = "insert into "+graphTable+" (name, description, unit, dashboard) values ("+mysql.escape(name)+
				", "+mysql.escape(description)+", "+mysql.escape(unit)+", "+mysql.escape(dashboard)+");";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to graph database "+err);
		callbackFunction(err);
	});
}

function addSignalToGraph(signalid, graphid, callbackFunction)
{
	var query = "insert into ?? (signalid, graphid) values (?, ?)";
	query = mysql.format(query,[correspondenceTable,signalid,graphid]);
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add value to table "+correspondenceTable+" "+err);
		callbackFunction(err);
	});
}

function addSignal(name, dashboarduuid, graphid, callbackFunction)
{
	var query = "select id from "+signalTable+" where name="+mysql.escape(name)+" and dashboarduuid="+
				mysql.escape(dashboarduuid)+";";
	connection.query(query, function(err,rows){
		if(!err)
		{
			if(rows.length == 0)
			{
				query = "insert into "+signalTable+" (name, dashboarduuid) values ("+mysql.escape(name)+
						", "+mysql.escape(dashboarduuid)+");";
				connection.query(query, function(err, rows){
					if(!err)
					{
						var signalid = rows.insertId;
						var signalTable =signalTablePrefix+signalid;
						query = "create table ?? (ts timestamp(3) not null , value DOUBLE NOT NULL, PRIMARY KEY(ts))";
						query = mysql.format(query, signalTable);
						connection.query(query, function(err,rows){
							if(err)
								console.log("Could not create table "+signalTable+" "+err);
							else
								addSignalToGraph(signalid,graphid,callbackFunction);
						});
					}
					else
						console.log("Could not add to table "+signalTable+" "+err);
				});
			}
			else
			{
				var signalid = rows.id;
				addSignalToGraph(signalid, graphid, callbackFunction)
			}
		}
		else
			console.log(signalTable+" database error: "+err);
	});
}

function addSignalValue(timestamp, value, signalid, callbackFunction)
{
	var signalValueTable = config.prefix+signalid;
	var query = "insert into "+dataName+" (timestamp, value) values (from_unixtime("+timestamp+"), "+
				mysql.escape(value)+");";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not add entry to database "+err);
		callbackFunction(err);
	});
}

function clearSignalValueTables(callbackFunction)
{
	var query = "select id from ?? ";
	query = mysql.format(query, signalTable);
	connection.query(query, function(err, rows){
		if(!err)
		{
			var existentSignals  = [];
			var allSignals = [];
			for(var i =0; i<rows.length; i++)
			{
				existentSignals.push(rows[i].id);
			}
			query = "show tables;";
			connection.query(query, function(err, rows){
				if(!err)
				{
					for(var i=0; i<rows.length; i++)
					{
						var row = rows[i]['Tables_in_'+config.database];
						if(row.substring(0,signalTablePrefix.length) == signalTablePrefix)
							allSignals.push(row.substring(signalTablePrefix.length));
					}
					var toDelete = _.difference(allSignals, existentSignals);
					var tables = "";
					for(var i=0; i<toDelete.length; i++)
					{
						tables = tables+signalTablePrefix+toDelete[i]+",";
					}
					tables = tables.substring(0,tables.length-1);
					if(tables.length>0)
					{
						query = "drop table if exists "+tables+";";
						connection.query(query, function(err){
							callbackFunction(err);
						});
					}
					else
						callbackFunction(err);
				}
				else
				{
					console.log("Cannot display tables "+err);
					callbackFunction(err);
				}
			});
		}
		else 
		{
			console.log("Cannot access table "+signalTable+' '+err);
			callbackFunction(err);
		}
	});
}

function deleteDashboard(dashboardId, callbackFunction)
{
	var signalsTable = config.prefix+mysql.escape(dashboardId);
	var query = "delete from "+dashboardTable+" where id = "+mysql.escape(dashboardId)+";";
	var tables = "";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not delete table "+dashboardTable+' '+err);
		else
		{
			clearSignalValueTables(function(err){
				callbackFunction(err);
			});
		}
	});
}

function deleteGraphFromDashboard(graphId, dashboardId, callbackFunction)
{
	var query = "delete from "+mysql.escape(graphTable)+" where id = "+mysql.escape(graphId)+";";
	connection.query(query, function(err, rows){
		if(err)
			console.log("Could not delete graph "+graphId+err);
		callbackFunction(err);
	});
}

function deleteSignal(signalid, callbackFunction)
{
	var query = "delete from ?? where id = ?";
	query = mysql.format(query,[signalTable, signalid]);
	connection.query(query,function(err, rows){
		if(err)
		{
			console.log("Could not delete signal "+signalid+" "+err);
			callbackFunction(err);
		}
		else
		{
			clearSignalValueTables(function(err){
				callbackFunction(err);
			});
		}
	});
}

function getAllDashboards(callbackFunction)
{
	var query = "select * from ??";
	query = mysql.format(query,dashboardTable);
	connection.query(query, function(err,rows){
		if(!err)
		{
			callbackFunction(err, rows);
		}
		else
		{
			console.log("Could not retrieve data from table "+dashboardTable+" "+err);
			callbackFunction(err);
		}
	});
}

function getDashboardGraphs(dashboardid, callbackFunction)
{
	var query = "select * from ?? where dashboard = ?";
	query = mysql.format(query,[graphTable, dashboard]);
	connection.query(query, function(err,rows){
		if(!err)
		{
			callbackFunction(err, rows);
		}
		else
		{
			console.log("Could not retrieve data from table "+dashboardTable+" "+err);
			callbackFunction(err);
		}
	});
}

function getDashboardSignals(dashboardid, callbackFunction)
{
	var query = "select uuid from ?? where id = ?";
	query = mysql.format(query,[dashboardTable, dashboardid]);
	connection.query(query, function(err,rows){
		if(!err)
		{
			if(rows.length>0)
			{
				var dashboarduuid = rows[0].id;
				query = "select * from ?? where dashboarduuid = ?";
				query = mysql.format(query, [signalTable, dashboarduuid]);
				connection.query(query, function(err, rows){
					if(!err)
					{
						callbackFunction(err, rows);
					}
					else
						callbackFunction(err);
				});
			}
			else
				callbackFunction(err, []);
		}
		else
		{
			console.log("Could not retrieve data from table "+dashboardTable+" "+err);
			callbackFunction(err);
		}
	});
}

function getGraphSignals(graphid, callbackFunction)
{
	var query = "select signalid from ?? where graphid = ?";
	query = mysql.format(query,[correspondenceTable, graphid]);
	connection.query(query, function(err,rows){
		if(!err)
		{
			if(rows.length>0)
			{
				var signalid = rows[0].signalid;
				query = "select * from ?? where id = ?";
				query = mysql.format(query, [signalTable, signalid]);
				connection.query(query, function(err, rows){
					if(!err)
					{
						callbackFunction(err, rows);
					}
					else
						callbackFunction(err);
				});
			}
			else
				callbackFunction(err, []);
		}
		else
		{
			console.log("Could not retrieve data from table "+graphTable+" "+err);
			callbackFunction(err);
		}
	});
}

function getSignalValues(signalid, callbackFunction)
{
	var query = "select * from";
	var tableName = signalTablePrefix+signalid;
	query = mysql.format(query,tableName);
	connection.query(query, function(err,rows){
		if(!err)
		{
			callbackFunction(err, rows);
		}
		else
		{
			console.log("Could not retrieve data from table "+tableName+" "+err);
			callbackFunction(err);
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
