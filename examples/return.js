"use strict";

var fs = require("fs");
var degenerate = require("..");
var readFile = degenerate.thunkify(fs.readFile);

degenerate(function* () {
	var a = yield readFile("MIT-LICENSE.txt");
	var b = yield "b";

	return [a.length, b];
}).then(function (value) {
	console.log(value);
}, function (reason) {
	// error
});