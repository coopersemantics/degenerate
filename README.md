# Degenerate

Generator-based asynchronous control flow for Node.js. Requires Node >= v0.11.x or greater, with the `--harmony-generators` flag, or just `--harmony`.

## Example Usage

```js
var degenerate = require("degenerate");
```

### Basic

Given `degenerate`'s usage of thunk-style functions wrapping asynchronous/synchronous operations, parallelism and sequential execution is possible. Provided below, is a basic example.

```js
var fs = require("fs");
var readFile = degenerate.thunkify(fs.readFile);

degenerate(function* () {
	var a = yield [0, 2, 3];
	var b = yield readFile("MIT-LICENSE.txt");
	var c = yield { a: "a", b: "b", c: "c" };

	console.log(a, b.length, c);
});
```

### Parallel

Using thunks makes it possible to achieve parallelism, by yielding after invocation.

```js
var fs = require("fs");
var request = require("request"); // `npm install request`
var get = degenerate.thunkify(request.get);
var readFile = degenerate.thunkify(fs.readFile);

degenerate(function* () {
	var a = get("http://google.com");
	var b = readFile("MIT-LICENSE.txt");
	var c = get("http://yahoo.com");

	console.log((yield a)[0].statusCode, (yield b).length, (yield c)[0].statusCode);
});
```

### Promises

`degenerate` supports promises. Below is an example of such, using `Q`.

```js
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
```

### Return

`degenerate` returns a promise. Upon completion of the generator, the promise is resolved, passing the returned value to the `onFulfilled` handler; however, if an error is caught, the error is passed to the `onRejected` handler. 

```js
var fs = require("fs");
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
```

### Nested

The `yield *` operator delegates to another generator, which can seen below.

```js
var fs = require("fs");
var readFile = degenerate.thunkify(fs.readFile);

var nested = function* nested() {
	return yield readFile("MIT-LICENSE.txt");
};

degenerate(function* () {
	var a = yield * nested();

	console.log(a.length);
});
```

### Extend

If you wish to extend `degenerate`, it is quite easy to do just that. Provided below is an example of just that.

```js
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
```

#### Request

`degenerate` supports the `request` module.

```js
var request = require("request"); // `npm install request`
var get = degenerate.thunkify(request.get);

degenerate(function* () {
	var a = yield get("http://google.com");
	var b = yield get("http://yahoo.com");

	console.log(a[0].statusCode, b[0].statusCode);
});
```

## Tests

TODO

## Versioning

Releases will be numbered using the following format:

```
<major>.<minor>.<patch>
```

And constructed with the following guidelines:

- Breaking backward compatibility **bumps the major** while resetting minor and patch.
- New additions without breaking backward compatibility **bumps the minor** while resetting the patch.
- Bug fixes and misc. changes **bumps only the patch**.

For more information on SemVer, please visit <http://semver.org/>.

## License

[MIT License](https://github.com/coopersemantics/degenerate/blob/master/MIT-LICENSE.txt).