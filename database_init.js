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

connection.connect();

function createGraphs()
{
	connection.query("show tables like '"+graphsName+"'", function(err, rows)
		{
			if(!err)
			{			
				if(rows.length==0)
				{
					connection.query("CREATE  TABLE "+graphsName+"(id INT NOT NULL AUTO_INCREMENT,"+
						"name VARCHAR(45) NOT NULL,description VARCHAR(45) NULL,unit VARCHAR(45) NOT NULL,dashboard INT NOT NULL,"+
					"PRIMARY KEY (id),INDEX dashboard (dashboard ASC),CONSTRAINT dash"+
					" FOREIGN KEY (dashboard) REFERENCES "+dashboardName+"(id)"+
					" ON DELETE CASCADE\n ON UPDATE CASCADE);", function(err, rows){
						console.log(err);
						if(err)
							console.log('cannot create table');
						connection.end();
					});
				}
				else
					connection.end();
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
			var tableName = PREFIX+dash
			connection.query("CREATE  TABLE "+dashboardName+"(id INT NOT NULL AUTO_INCREMENT ,"+
							"name VARCHAR(45) NOT NULL ,description VARCHAR(45) NULL , PRIMARY KEY (id));",
			function(err, rows){
				if(err)
					console.log('cannot create table');
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
		console.log(err)
		connection.end();
	}
});
