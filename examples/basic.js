"use strict";

var fs = require("fs");
var degenerate = require("..");
var readFile = degenerate.thunkify(fs.readFile);

degenerate(function* () {
	var a = yield [0, 2, 3];
	var b = yield readFile("MIT-LICENSE.txt");
	var c = yield { a: "a", b: "b", c: "c" };

	console.log(a, b.length, c);
});