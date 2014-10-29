"use strict";

var fs = require("fs");
var degenerate = require("..");
var readFile = degenerate.thunkify(fs.readFile);

var nested = function* nested() {
	return yield readFile("MIT-LICENSE.txt");
};

degenerate(function* () {
	var a = yield * nested();

	console.log(a.length);
});