"use strict"

var config = require('./config.js').data;
var mysql = require('mysql');
var uuid = require('node-uuid');
var _ = require('underscore');
var async=require("async");

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
var signalTablePrefix = config.prefix+'signalvalue_';
var buttonTable = config.prefix+'button';

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
	connection.query(query, function(err, result){
		if(err)
		{
			console.log("Could not add entry to dashboard database "+err);
			callbackFunction(err);
		}
		else
			callbackFunction(err, result.insertId);
	});
}

function addGraph(name, description, unit, type,dashboard, callbackFunction)
{
	name = parseName(name);
    var graphDescription=description;
    var graphUnit=unit;
    var graphType=type;

	var query = "insert into "+graphTable+" (name, description, unit, type, dashboard) values ("+mysql.escape(name)+
				", "+mysql.escape(description)+", "+mysql.escape(unit)+", "+mysql.escape(type)+", "
				+mysql.escape(dashboard)+");";
	connection.query(query, function(err, result){
		if(err)
		{
			console.log("Could not add entry to graph database "+err);
			callbackFunction(err);
		}
		else
			callbackFunction(err, result.insertId);
	});
}

function addSignalToGraph(signalid, graphid, callbackFunction)
{
	var query = "insert into ?? (signalid, graphid) values (?, ?)";
	query = mysql.format(query,[correspondenceTable,signalid,graphid]);
	connection.query(query, function(err, result){
		if(err)
			console.log("Could not add value to table "+correspondenceTable+" "+err);
		callbackFunction(err, signalid);
	});
}


function addSignal(name, dashboarduuid, graphId, callbackFunction)
{
    //var signalName=mysql.escape(name);
	//var query = "select id from "+signalTable+" where name="+mysql.escape(name)+" and dashboarduuid="+mysql.escape(dashboarduuid)+";";
    var query = "SELECT id FROM "+signalTable+" WHERE name="+mysql.escape(name)+" AND dashboarduuid="+mysql.escape(dashboarduuid)+";";
	connection.query(query, function(err,rows){
        if(err){
            console.log(err);
            return;
        }
        if(rows.length!=0){
            var signalId=rows.id;
            addSignalToGraph(signalId, graphId, callbackFunction);
            return;
        }
        query="INSERT INTO "+signalTable+" VALUES(NULL,'"+name+"','"+dashboarduuid+"')";
        connection.query(query,function(err,rows){
            if(err){
                console.log("Could not add to table "+signalTable+" "+err);
                return;
            }
            var signalId=rows.insertId;
            var signalTable=signalTablePrefix+signalId;
            query="CREATE TABLE ?? (ts timestamp(3) not null, value DOUBLE not null, PRIMARY KEY(ts))";
            query=mysql.format(query,signalTable);
            connection.query(query,function(err,rows){
                if(err){
                    console.log("Could not create table "+signalTable+" "+err);
                    return;
                }
                addSignalToGraph(signalId,graphId,callbackFunction);
            });
        });
		/*if(!err)
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
								addSignalToGraph(signalid,graphId,callbackFunction);
						});
					}
					else
						console.log("Could not add to table "+signalTable+" "+err);
				});
			}
			else
			{
				var signalid = rows.id;
				addSignalToGraph(signalid, graphId, callbackFunction)
			}
		}
		else
			console.log(signalTable+" database error: "+err);*/
	});
}

// addSignalValue(1421486107,20,"sig", "c2cab7bf8a344f178656a659d95441f2",function(){});
// addSignalValue(1421486111,21,"sig", "c2cab7bf8a344f178656a659d95441f2",function(){});
// addSignalValue(1421486108,22,"sig", "c2cab7bf8a344f178656a659d95441f2",function(){});

function addSignalValue(timestamp, value, name, dashuuid, callbackFunction)
{
	var query = "select id from ?? where name = ? and dashboarduuid = ?";
	query = mysql.format(query,[signalTable,name,dashuuid]);
	connection.query(query, function(err, rows){
		if(!err)
		{
			if(rows.length>0)
			{
				var signalid = rows[0].id;
				var signalValueTable = signalTablePrefix+signalid;
				query = "insert into "+signalValueTable+" (ts, value) values (from_unixtime("+timestamp+"), "+
						mysql.escape(value)+");";
				connection.query(query, function(err, rows){
				if(err)
					console.log("Could not add entry to database "+err);
				callbackFunction(err);
				});		
			}
			else
			{
				console.log("Permission denied");
				callbackFunction(-1);
			}
			
		}
		else
		{
			console.log("Could not acces table "+signalTable+' '+err);
			callbackFunction(err);
		}	
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
	//var signalsTable = config.prefix+mysql.escape(dashboardId);
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

function removeGraph(graphId, callbackFunction){
    console.log(graphId);
    var query="delete from "+graphTable+" where id=" +mysql.escape(graphId)+";";
    connection.query(query, function(err, rows){
        if(err) {
            console.log("Could not delete graph " + dashboardTable + ' ' + err);
            return;
        }
           /* clearSignalValueTables(function(err){
                callbackFunction(err);
            });*/
        console.log("delete");
        callbackFunction(err);
    });
}

/*function removeSignal(graphId, callbackFunction){
    var query="SELECT * FROM "+correspondenceTable+" WHERE graphid="+graphId;
}*/

function renameDashboard(dashboardId, name, callbackFunction){
    var signalsTable = config.prefix+mysql.escape(dashboardId);
    var query = "update "+dashboardTable+" set name="+mysql.escape(name)+" where id = "+mysql.escape(dashboardId)+";";
    var tables = "";
    connection.query(query, function(err, rows){
        if(err)
            console.log("Could not rename table "+dashboardTable+' '+err);
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

function getDashboardGraphs(dashboardId, callbackFunction)
{
	var query = "select * from ?? where dashboard = ?";
	query = mysql.format(query,[graphTable, dashboardId]);
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

function getDashboardsGraphsWithSignals(dashboardId, callbackFunction){
    //create the query to get all the graphs with their signals
    var query="SELECT " +
        "graphs.id as graphId, graphs.name as graphName, graphs.description as graphDescription, graphs.unit as graphUnit, graphs.type as graphType," +
        "signals.id as signalId, signals.name as signalName, signals.dashboarduuid as signalDashboardUUID " +
        "FROM "+graphTable+" graphs " +
        "INNER JOIN "+correspondenceTable+" correspondence ON graphs.id=correspondence.graphid "+
        "INNER JOIN "+signalTable+" signals ON correspondence.signalid=signals.id " +
        "WHERE graphs.dashboard="+dashboardId;
    //execute the query
    connection.query(query,function(err,rows){
        if(err){
            console.log("Could not retrieve graphs and signals data"+graphTable+" "+err);
            callbackFunction(err,[]);
            return;
        }

        var graphs=new Array();
        //console.log(rows.length);
        for(var index=0;index<rows.length;index++) {
            if(!arrayContainsElement(graphs,rows[index],function(param1,param2){return param1.graphId==param2.graphId})){
                graphs.push({
                    graphId: rows[index].graphId,
                    graphName: rows[index].graphName,
                    graphDescription: rows[index].graphDescription,
                    graphUnit: rows[index].graphUnit,
                    graphType: rows[index].graphType,
                    graphSignals: new Array({
                        signalId: rows[index].signalId,
                        signalName: rows[index].signalName,
                        signalDatetime: 1,
                        signalDashboardUUID: rows[index].signalDashboardUUID
                    })
                });
            }
            else{
                var graph;
                for(var graphIndex=0;graphIndex<graphs.length;graphIndex++)
                    if(graphs[graphIndex].graphId==rows[index].graphId){
                        graph=graphs[graphIndex];
                        break;
                    }
                if(!arrayContainsElement(graph.graphSignals,rows[index],function(param1,param2){return param1.signalId==param2.signalId}))
                    graph.graphSignals.push({
                        signalId: rows[index].signalId,
                        signalName: rows[index].signalName,
                        signalDashboardUUID: rows[index].signalDashboardUUID
                    });
            }
        }

        callbackFunction(err,graphs);

    });
}

function getSignalsValues(signalsInfos,callbackFunction){

    var query="SELECT TABLE_NAME AS name FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE '"+signalTablePrefix +"%'";// WHERE 'wsignalvalue%'
    connection.query(query,function(err,rows){
        if(err){
            console.log(err);
            return;
        }

        var wsignalValuesTablesInfos=new Array();
        for(var rowIndex=0;rowIndex<rows.length;rowIndex++) {
            var signalTableId = rows[rowIndex].name.substr(signalTablePrefix.length, rows[rowIndex].name.length);
            for (var signalInfoIndex = 0; signalInfoIndex < signalsInfos.length; signalInfoIndex++)
                if (signalsInfos[signalInfoIndex].signalId == signalTableId)
                    wsignalValuesTablesInfos.push(signalsInfos[signalInfoIndex]);
        }

        //console.log(wsignalValuesTablesInfos.length);
        if(wsignalValuesTablesInfos.length==0)
            callbackFunction(err,[]);

        var queryFunctions=new Array();
        var signalsWithValues=new Array();
        for(var wSignalTableId=0;wSignalTableId<wsignalValuesTablesInfos.length;wSignalTableId++) {
            queryFunctions.push(function (index,signalsWithValues, localCallbackFunction) {

                var query="SELECT * FROM "+signalTable+" signals " +
                "INNER JOIN "+correspondenceTable+" ON signals.id=signalid " +
                "INNER JOIN " +graphTable+" graphs ON graphs.id=graphid "+
                "WHERE signals.id="+wsignalValuesTablesInfos[index].signalId;

                connection.query(query, function(err,rows){
                    if(err){
                        console.log(err);
                        return;
                    }

                    if(rows[0]["type"]=="speedometer") {
                        //console.log(wsignalValuesTablesInfos[index].signalDatetime);
                        query = "SELECT MAX(UNIX_TIMESTAMP(ts)) as ts,value as value FROM " + signalTablePrefix + wsignalValuesTablesInfos[index].signalId;
                    }
                    else
                        query="SELECT UNIX_TIMESTAMP(ts) as ts,value as value FROM "+signalTablePrefix+wsignalValuesTablesInfos[index].signalId+" WHERE UNIX_TIMESTAMP(ts) > "+wsignalValuesTablesInfos[index].signalDatetime+" ORDER BY ts ASC";
                    connection.query(query, function (err, rows) {
                        if(err){
                            console.log(err);
                            return;
                        }
                        //console.log(rows);
                        var pairsArray=new Array();
                        for(var rowIndex=0;rowIndex<rows.length;rowIndex++)
                            pairsArray.push([rows[rowIndex]["ts"],rows[rowIndex]["value"]]);
                        signalsWithValues.push({signalId:wsignalValuesTablesInfos[index].signalId, signalName:wsignalValuesTablesInfos[index].signalName,signalValues:pairsArray});
                        if(index==wsignalValuesTablesInfos.length-1){
                            callbackFunction(err,signalsWithValues);
                        }
                        localCallbackFunction();
                    })
                });

                //var query="SELECT UNIX_TIMESTAMP(ts) as ts,value as value FROM "+signalTablePrefix+wsignalValuesTablesInfos[index].signalId+" WHERE UNIX_TIMESTAMP(ts) > "+wsignalValuesTablesInfos[index].signalDatetime+" ORDER BY ts ASC";

            }.bind (null, wSignalTableId, signalsWithValues));
        }

        async.series(queryFunctions);

    })
}

function arrayContainsElement(elementsArray,element,compareFunction){
    for(var index=0;index<elementsArray.length;index++) {
        if(compareFunction(elementsArray[index],element))
            return true;
    }
    return false;
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

function getGraphSignals(graphId, callbackFunction)
{
	var query = "select * from ?? where graphid = ?";
	query = mysql.format(query,[correspondenceTable, graphId]);
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
//gets all the data for every graph of a dashboard
function getGraphSignalsForDashBoard(dashboardId, datetime, callbackFunction){
    var query="SELECT * FROM "+graphTable+" WHERE dashboard="+dashboardId;
    connection.query(query,function(err,rows){
        if(err) {
            console.log("Could not retrieve data from table " + graphTable + " " + err);
            callbackFunction(err);
        }
        if(rows.length==0)
            callbackFunction(err,[]);

        //get graph ids for query
        var graphIds="";
        for(var index=0;index<rows.length;index++)
            graphIds += rows[index].id+",";
        graphIds=graphIds.substr(0,graphIds.length-1);

        //get all graph signals
        query="SELECT * FROM "+correspondenceTable+" WHERE graphid IN("+graphIds+")";
        connection.query(query,function (serr, rows) {
            if(serr){
                callbackFunction(serr);
            }
            if(rows.length==0)
                callbackFunction(serr,[]);

            for(var index=0;index<rows.length;index++){
                query="SELECT * FROM ";
                //console.log(rows[index]);
            }
        });
    });
}

/*function getSignalsValues(signalid, callbackFunction)
{
	var query = "select value, UNIX_TIMESTAMP(ts) as ts from ??";
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
}*/

function getDashboard(dashboardId, callbackFunction)
{
	var query = "select * from "+dashboardTable+" where id = "+mysql.escape(dashboardId)+";";
	connection.query(query, function(err,rows){
		if(!err && rows.length>0)
		{
			callbackFunction(null,rows[0]);
		}
		else {
            callbackFunction(err, null);
        }
	})
}

function getLatestSignalValue(signalid, callbackFunction)
{
	var signalValueTable = signalTablePrefix+signalid;
	var query = "SELECT value, UNIX_TIMESTAMP(ts) as ts FROM ??  ORDER BY ts DESC LIMIT 0,1";
	query = mysql.format(query, [signalValueTable, signalValueTable]);
	connection.query(query, function(err, rows){
		if(!err)
		{
			if(rows.length>0)
			{
				callbackFunction(err, rows[0].value);
			}
			else
			{
				console.log("No signals "+signalid);
				callbackFunction("No signals "+signalid);
			}
		}
		else
		{
			console.log("Could not retrieve data from table "+signalValueTable+" "+err);
			callbackFunction(err);
		}
	});
}

function getSignalValueInInterval(signalid, min, max, callbackFunction)
{
	var signalValueTable = signalTablePrefix+signalid;
	var query;
	if(max)
	{
		query = "select value, UNIX_TIMESTAMP(ts) as ts from ?? where UNIX_TIMESTAMP(ts) between ? and ?";
		query = mysql.format(query,[signalValueTable, min, max]);
	}
	else
	{
		query = "select value, UNIX_TIMESTAMP(ts) as ts from ?? where UNIX_TIMESTAMP(ts) > ?";
		query = mysql.format(query,[signalValueTable, min]);
	}
	connection.query(query, function(err, rows){
		callbackFunction(err, rows);	
	});
}

function getButtonValue(id, callbackFunction)
{
	var query = "select * from ?? where id=?";
	query = mysql.format(query,[buttonTable,id]);
	connection.query(query, function(err, rows){
		callbackFunction(err, rows);
	});
}

function getDashboardButtons(dashboarduuid, callbackFunction)
{
	var query = "select id as buttonId, name as buttonName, type as buttonType, value as buttonValue, dashboarduuid as dashboardUUID from ?? where dashboarduuid=?";
	query = mysql.format(query,[buttonTable,dashboarduuid]);
	connection.query(query, function(err,buttons){
		callbackFunction(err, buttons);
	});
}

function addButton(dashboarduuid, type, name, value, callbackFunction)
{
	var query = "insert into ?? (dashboarduuid, name, type, value) values (?,?,?,?)";
	query = mysql.format(query,[buttonTable,dashboarduuid,name,type,value]);
	connection.query(query,function(err, result){
		if(!err)
			callbackFunction(err,result.insertId);
		else
			callbackFunction(err,null);
	});
}

function updateButton(id,value,callbackFunction)
{
	var query = "update ?? set value=? where id=?";
	query = mysql.format(query,[buttonTable, value, id]);
	connection.query(query, function(err,result){
		callbackFunction(err);
	});
}

function getButton(dashboarduuid, name, callbackFunction)
{
	var query = "select value from ?? where name=? and dashboarduuid=?";	
	query = mysql.format(query, [buttonTable,name,dashboarduuid]);
	connection.query(query, function(err, result){
		callbackFunction(err, result[0]);
	});
}

function setButtonValue(buttonId, buttonValue, callbackFunction){
    buttonId=mysql.escape(buttonId);
    buttonValue=mysql.escape(buttonValue);
    console.log(buttonValue)
    var query="UPDATE "+buttonTable+" SET value="+buttonValue+" WHERE id="+buttonId;
    connection.query(query, function(err, result){
        callbackFunction(err, result);
    });
}

function setSensorDescription(graphId,graphDescription, callbackFunction){
    graphId=mysql.escape(graphId);
    graphDescription=mysql.escape(graphDescription);
    var query="UPDATE "+graphTable+" SET description="+graphDescription+" WHERE id="+graphId;
    connection.query(query,function(err,result){
        if(err)
            console.log(err);
        callbackFunction(err,result);
    });
}

exports.addGraph=addGraph;
exports.addSignal = addSignal;
exports.addButton = addButton;
exports.addDashboard = addDashboard;
exports.getDashboard = getDashboard;

exports.getAllDashboards = getAllDashboards;
exports.getDashboard = getDashboard;
exports.getDashboardsGraphsWithSignals=getDashboardsGraphsWithSignals;
exports.getDashboardButtons = getDashboardButtons;
exports.getSignalsValues=getSignalsValues;

exports.setButtonValue=setButtonValue;
exports.setSensorDescription=setSensorDescription;

exports.renameDashboard= renameDashboard;

exports.removeGraph=removeGraph;
exports.deleteDashboard = deleteDashboard;
/*exports.addSignal = addSignal;

exports.getDashboardButtons = getDashboardButtons;
exports.getButtonValue = getButtonValue;
exports.getDashboard = getDashboard;
exports.getAllDashboards = getAllDashboards;
exports.getDashboard = getDashboard;
exports.getDashboardGraphs = getDashboardGraphs;
exports.getSignalsValues = getSignalsValues;
exports.deleteDashboard = deleteDashboard;
exports.getGraphSignals = getGraphSignals;
exports.addSignalValue = addSignalValue;
exports.getLatestSignalValue = getLatestSignalValue;
exports.getSignalValueInInterval = getSignalValueInInterval;
exports.updateButton = updateButton;
exports.getButton = getButton;

//mod victor
exports.renameDashboard= renameDashboard;
exports.removeGraph=removeGraph;

exports.getGraphSignalsForDashBoard=getGraphSignalsForDashBoard;

exports.getDashboardsGraphsWithSignals=getDashboardsGraphsWithSignals;
exports.getSignalsValues=getSignalsValues;*/
