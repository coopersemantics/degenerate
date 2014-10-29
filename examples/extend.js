"use strict";

var degenerate = require("..");

degenerate.extend({
	duplicateToArray: function (value, times) {
		var index = 0;
		var values = [];

		return function (done) {
			while (times > index++) {
				values.push(value);
			}

			done(null, values);
		};
	}
});

degenerate(function* () {
	var a = yield degenerate.duplicateToArray("Howdy, guy!", 3);

	console.log(a);
});