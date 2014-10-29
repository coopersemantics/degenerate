"use strict";

var Q = require("q");

var slice = Array.prototype.slice;

/**
 * Determines if a given `value` is a generator function.
 * @param {*} value
 * @returns {boolean}
 * @private
 */

var isGenerator = function isGenerator(value) {
	return value && value.constructor && "GeneratorFunction" === value.constructor.name;
};

/**
 * Determines if a given `value` is a promise.
 * @param {*} value
 * @returns {boolean}
 * @private
 */

var isPromise = function isPromise(value) {
	return value && "function" === typeof value.then;
};

/**
 * Wraps a `string|object` in a thunk-style function.
 * @param {string|object} value
 * @returns {function}
 * @private
 */

var wrap = function wrap(value) {
	return function (done) {
		done(null, value);
	};
};

/**
 * Wraps a `promise` in a thunk-style function.
 * @param {object} promise
 * @returns {function}
 * @private
 */

var wrapPromise = function wrapPromise(promise) {
	return function (done) {
		promise.then(function(value) {
			done(null, value);
		}, done);
	};
};

/**
 * Wraps a given `value` in a thunk-style function.
 * @param {*} value
 * @returns {function}
 * @private
 */

var toThunk = function toThunk(value) {
	if (isPromise(value)) {
		return wrapPromise(value);
	} else if ("function" !== typeof value) {
		return wrap(value);
	}

	return value;
};

/**
 * Wraps a given `generator` and returns a promise.
 * @param {function} generator
 * @returns {object}
 * @public
 */

var degenerate = module.exports = function degenerate(generator) {
	var deferred;
	var gen;
	var next;
	var genError;

	if (!isGenerator(generator)) {
		throw new TypeError("The supplied argument is not a `GeneratorFunction`.");
	}

	deferred = Q.defer();
	gen = generator();

	genError = function (error) {
		try {
			gen.throw(error);
		} catch (err) {
			return err;
		}
	};

	next = function next(error, value) {
		var arity = arguments.length;
		var layer;

		if (error) {
			return deferred.reject(genError(error));
		}

		if (arity  > 2) {
			value = slice.call(arguments, 1);
		}

		try {
			layer = gen.next(value);
		} catch (err) {
			return next(err);
		}

		if (layer.done) {
			return deferred.resolve(layer.value);
		}

		toThunk(layer.value)(next);
	};

	next();

	return deferred.promise;
};

/**
 * Wraps a given `fn` as a thunk-style function.
 * @param {function} fn
 * @returns {function}
 * @public
 */

degenerate.thunkify = function thunkify(fn) {
	if ("function" !== typeof fn) {
		throw new TypeError("The supplied argument needs to be a function.");
	}

	return function () {
		var context = this;
		var args = slice.call(arguments);

		return function (done) {
			args.push(done);

			try {
				fn.apply(context, args);
			} catch (err) {
				done(err);
			}
		};
	};
};

/**
 * Extends `degenerate` with a given `object`.
 * @param {object|function} object
 * @returns {void}
 * @public
 */

degenerate.extend = function (object) {
	var property;

	for (property in object) {
		if (object.hasOwnProperty(property)) {
			this[property] = object[property];
		}
	}
};