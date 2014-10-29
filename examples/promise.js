"use strict";

var degenerate = require("..");
var Q = require("q"); // `npm install q`

var promise = function promise(message, timeInMS) {
	var deferred = Q.defer();

	setTimeout(function () {
		deferred.resolve(message);
	}, timeInMS);

	return deferred.promise;
};

degenerate(function* () {
	var a = yield promise("Promise me, you will behave yourself!", 3000);
	var b = yield promise("Promise me, you won't behave yourself!", 1000);

	console.log(a, b);
});
