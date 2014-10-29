"use strict";

var fs = require("fs");
var degenerate = require("..");
var request = require("request"); // `npm install request`
var get = degenerate.thunkify(request.get);
var readFile = degenerate.thunkify(fs.readFile);

degenerate(function* () {
	var a = get("http://google.com");
	var b = readFile("MIT-LICENSE.txt");
	var c = get("http://yahoo.com");
	
	console.log((yield a)[0].statusCode, (yield b).length, (yield c)[0].statusCode);
});