var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');

app.use(session({secret:'shhh'}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/html",express.static(path.join(__dirname, 'public/html')));
require('./routes/index')(app);

var server=app.listen(3000,function(){
    console.log("We have started our server on port 3000");
});