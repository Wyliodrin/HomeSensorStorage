var express=require('express');
var app=express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

require('./routes/index')(app);
var server=app.listen(3000,function(){
console.log("We have started our server on port 3000");
});