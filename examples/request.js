"use strict";

var degenerate = require("..");
var request = require("request"); // `npm install request`
var get = degenerate.thunkify(request.get);

degenerate(function* () {
	var a = yield get("http://google.com");
	var b = yield get("http://yahoo.com");

	console.log(a[0].statusCode, b[0].statusCode);
});