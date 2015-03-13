"use strict"

var config = require('./config.js').data;
var HOST = config.host;
var USER = config.username;
var PASSWD = config.password;
var PREFIX = config.prefix;
var DATABASE = config.database;

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : HOST,
  user     : USER,
  password : PASSWD,
  database: DATABASE
});
var dashboardName = PREFIX+'dashboard';
var graphsName = PREFIX+'graph';
var buttonTable = PREFIX+'button';

connection.connect();

function createGraphs()
{
	connection.query("show tables like '"+graphsName+"'", function(err, rows)
		{
			if(!err)
			{			
				if(rows.length==0)
				{
					connection.query("CREATE  TABLE "+graphsName+"" +
                    "(id INT NOT NULL AUTO_INCREMENT,"+
                    "name VARCHAR(45) NOT NULL," +
                    "description VARCHAR(45) NULL," +
                    "unit VARCHAR(45) NULL," +
                    "type VARCHAR(45) NOT NULL," +
                    "dashboard INT NOT NULL,"+
					"PRIMARY KEY (id)," +
                    "INDEX dashboard (dashboard ASC)," +
                    "CONSTRAINT dash"+
					" FOREIGN KEY (dashboard) REFERENCES "+dashboardName+"(id)"+
					" ON DELETE CASCADE\n ON UPDATE CASCADE);", function(err, rows){
						//console.log(err);
						if(err)
							console.log('cannot create table '+err);
						else
							createSignals();
					});
				}
				else
					createSignals();
			}
			else
			{
				console.log(err);
				connection.end();
			}
		});
}

function createSignals()
{
	var signalTable = PREFIX+'signal';
	connection.query("show tables like '"+signalTable+"'", function(err, rows){
		if(!err)
		{
			if(rows.length == 0)
			{
				var query = "CREATE  TABLE "+signalTable+" " +
                    "(id INT NOT NULL AUTO_INCREMENT, " +
                    "name VARCHAR(45) NULL, "+
				    "dashboarduuid VARCHAR(150) NOT NULL ," +
                    "PRIMARY KEY (id), " +
                    "CONSTRAINT uc_name_dash UNIQUE (name, dashboarduuid),"+
				    "CONSTRAINT c FOREIGN KEY(dashboarduuid) REFERENCES "+dashboardName+"(uuid) ON UPDATE CASCADE ON DELETE CASCADE);";
				connection.query(query,function(err,rows){
					if(err)
						console.log('cannot create table '+err);
					else
						createCorrespondence();
				});
			}
			else
			{
				createCorrespondence();
			}
		}
		console.log(err);
	});
}

function createButtons()
{
	var query = "show tables like ?";
	query = mysql.format(query, [buttonTable]);
	console.log(query);
	connection.query(query, function(err, rows){
		if(!err)
		{
			if(rows.length == 0)
			{
				query = "CREATE TABLE ?? (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, dashboarduuid VARCHAR(150) NOT NULL, "+
					"name VARCHAR(45) NOT NULL, type VARCHAR(45),value INT ,CONSTRAINT cons FOREIGN KEY(dashboarduuid) REFERENCES ??(uuid) "+
					"ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT uc_n_DASH UNIQUE (name, dashboarduuid))";
				query = mysql.format(query, [buttonTable, dashboardName]);
				console.log(query);
				connection.query(query, function(err, rows){
					if(err)
						console.log(err);
					connection.end();
				});
			}
		}
		else
		{
			console.log(err);
			connection.end();
		}
	});
}

function createCorrespondence()
{
	var correspondenceTable = PREFIX+'correspondence';
	var signalTable = PREFIX+'signal';
	var graphTable = PREFIX+'graph';
	connection.query("show tables like '"+correspondenceTable+"'", function(err, rows){
		if(!err)
		{
			if(rows.length == 0)
			{
				var query = "CREATE  TABLE "+correspondenceTable+"(signalid INT NOT NULL ,graphid INT NOT NULL, "+
				"INDEX fk1 (signalid, graphid), CONSTRAINT f1 FOREIGN KEY (signalid) REFERENCES "+
				signalTable+" (id) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT f2 FOREIGN KEY (graphid) REFERENCES "+
				graphTable+"(id) ON DELETE CASCADE ON UPDATE CASCADE);";
				connection.query(query,function(err,rows){
					if(err)
						console.log("Cannot create database "+err);
					else
						createButtons()
				});
			}
			else 
				createButtons();
		}
		else
		{
			console.log(err);
			connection.end();
		}
	}); 
}

connection.query("show tables like '"+dashboardName+"'", function(err, rows)
{
	if(!err)
	{
		if(rows.length == 0)
		{
			var tableName = PREFIX+'dashboard';
			connection.query("CREATE  TABLE "+dashboardName+"(id INT NOT NULL AUTO_INCREMENT ,"+
							"name VARCHAR(45) NOT NULL ,description VARCHAR(45) NULL, uuid VARCHAR(150),PRIMARY KEY (id), UNIQUE INDEX uuid (uuid), UNIQUE(name));",
			function(err, rows){
				if(err)
					console.log('cannot create table '+err);
				else
				{
					createGraphs();
				}
			});
		}
		else
			createGraphs();
	}
	else
	{
		console.log(err);
		connection.end();
	}
});
