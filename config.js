"use strict"
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('settings.json','utf8'));
exports.data = obj;