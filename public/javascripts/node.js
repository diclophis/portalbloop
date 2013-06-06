require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"util":[function(require,module,exports){
module.exports=require('+c0iQh');
},{}],"+c0iQh":[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":1}],"assert":[function(require,module,exports){
module.exports=require('P++JCd');
},{}],"P++JCd":[function(require,module,exports){
(function(){// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

})()
},{"util":"+c0iQh","buffer":2}],3:[function(require,module,exports){
(function(){// bloop
})()
},{"assert":"P++JCd","util":"+c0iQh","imap":"qIWmyf"}],"net":[function(require,module,exports){
module.exports=require('8b6xEy');
},{}],"8b6xEy":[function(require,module,exports){
(function(){/*
   Copyright 2012 Google Inc

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var net = module.exports;
var events = require('events');
var util = require('util');
var Stream = require('stream');
var Buffer = require('buffer').Buffer;

var stringToArrayBuffer = function(str) {
  var buffer = new ArrayBuffer(str.length);
  var uint8Array = new Uint8Array(buffer);
  for(var i = 0; i < str.length; i++) {
    uint8Array[i] = str.charCodeAt(i);
  }
  return buffer;
};

var bufferToArrayBuffer = function(buffer) {
  return stringToArrayBuffer(buf.toString())
};

var arrayBufferToBuffer = function(arrayBuffer) {
  var buffer = new Buffer(arrayBuffer.byteLength);
  var uint8Array = new Uint8Array(arrayBuffer);
  for(var i = 0; i < uint8Array.length; i++) {
    buffer.writeUInt8(uint8Array[i], i, true);
  }
  return buffer;
};

net.createServer = function() {
  var options = {
  };
  var args = arguments;

  var cb = args[args.length -1];
  cb = (typeof cb === 'function') ? cb : function() {};

  if(typeof args[0] === 'object') {
    options = args[0];
  }

  var server = new net.Server(options);
  server.on("connection", cb);
  return server;
};

net.connect = net.createConnection = function() {
  var options = {};
  var args = arguments;
  if(typeof args[0] === 'object') {
    options.port = args[0].port;
    options.host = args[0].host || "127.0.0.1";
  }
  else if(typeof args[0] === 'number') {
    // there is a port
    options.port = args[0];
    if(typeof args[1] === 'string') {
      options.host = args[1];
    }
  }
  else if(typeof args[0] === 'string') {
    return; // can't do this.
  }

  var cb = args[args.length -1];
  cb = (typeof cb === 'function') ? cb : function() {};

  var socket = new net.Socket(options, function() {
    socket.connect(options, cb);
  });

  return socket;
};

function Server() {
  var _maxConnections = 0;
  this.__defineGetter__("maxConnections", function() { return _maxConnections; });

  var _connections = 0;
  this.__defineGetter__("connections", function() { return _connections; });

  events.EventEmitter.call(this);
  // if (!(this instanceof Server)) return new Server(arguments[0], arguments[1]);
  // events.EventEmitter.call(this);

  // var self = this;

  // var options;

  // if (typeof arguments[0] == 'function') {
  //   options = {};
  //   self.on('connection', arguments[0]);
  // } else {
  //   options = arguments[0] || {};

  //   if (typeof arguments[1] == 'function') {
  //     self.on('connection', arguments[1]);
  //   }
  // }

  // this._connections = 0;

  // // when server is using slaves .connections is not reliable
  // // so null will be return if thats the case
  // Object.defineProperty(this, 'connections', {
  //   get: function() {
  //     if (self._usingSlaves) {
  //       return null;
  //     }
  //     return self._connections;
  //   },
  //   set: function(val) {
  //     return (self._connections = val);
  //   },
  //   configurable: true, enumerable: true
  // });

  // this.allowHalfOpen = options.allowHalfOpen || false;

  // this._handle = null;
}
net.Server = Server;
util.inherits(net.Server, events.EventEmitter);

net.Server.prototype.listen = function() {
  var self = this;
  var options = {};
  var args = arguments;

  if (typeof args[0] === 'number') {
    // assume port. and host.
    options.port = args[0];
    options.host = "127.0.0.1";
    options.backlog = 511;
    if(typeof args[1] === 'string') {
      options.host = args[1];
    }
    else if(typeof args[1] === 'number') {
      options.backlog = args[1];
    }

    if(typeof args[2] === 'number') {
      options.backlog = args[2];
    }
  }
  else {
    // throw.
  }

  this._serverSocket = new net.Socket(options);

  var cb = args[args.length -1];
  cb = (typeof cb === 'function') ? cb : function() {};

  self.on('listening', cb);

  self._serverSocket.on("_created", function() {
    // Socket created, now turn it into a server socket.
    chrome.socket.listen(self._serverSocket._socketInfo.socketId, options.host, options.port, options.backlog, function() {
      self.emit('listening');
      chrome.socket.accept(self._serverSocket._socketInfo.socketId, self._accept.bind(self));
    });
  });
};

net.Server.prototype._accept = function(acceptInfo) {
  // Create a new socket for the handle the response.
  var self = this;
  var socket = new net.Socket();

  socket._socketInfo = acceptInfo;
  self.emit("connection", socket);

  chrome.socket.accept(self._serverSocket._socketInfo.socketId, self._accept.bind(self));

  socket._read();
};

net.Server.prototype.close = function(callback) {
  self.on("close", callback || function() {});
  self._serverSocket.destroy();
  self.emit("close");
};
net.Server.prototype.address = function() {};

net.Socket = function(options) {
  var createNew = false;
  if(options){
    createNew = true;
  }
  var self = this;
  options = options || {};
  this._fd = options.fd;
  this._type = options.type || "tcp";
  //assert(this._type === "tcp6", "Only tcp4 is allowed");
  //assert(this._type === "unix", "Only tcp4 is allowed");
  this._type = allowHalfOpen = options.allowHalfOpen || false;
  this._socketInfo = 0;
  this._encoding;

  if(createNew){
    chrome.socket.create("tcp", {}, function(createInfo) {
      self._socketInfo = createInfo;
      self.emit("_created"); // This event doesn't exist in the API, it is here because Chrome is async
      // start trying to read
      // self._read();
    });
  }
};

util.inherits(net.Socket, Stream);

/*
  Events:
    close
    connect
    data
    drain
    end
    error
    timeout
*/

/*
  Methods
*/

net.Socket.prototype.connect = function() {
  var self = this;
  var options = {};
  var args = arguments;

  if(typeof args[0] === 'object') {
    // we have an options object.
    options.port = args[0].port;
    options.host = args[0].host || "127.0.0.1";
  }
  else if (typeof args[0] === 'string') {
    // throw an error, we can't do named pipes.
  }
  else if (typeof args[0] === 'number') {
    // assume port. and host.
    options.port = args[0];
    options.host = "127.0.0.1";
    if(typeof args[1] === 'string') {
      options.host = args[1];
    }
  }

  var cb = args[args.length -1];
  cb = (typeof cb === 'function') ? cb : function() {};
  self.on('connect', cb);
  chrome.socket.connect(self._socketInfo.socketId, options.host, options.port, function(result) {
    if(result == 0) {


    console.log('install tls here', this);

         window.TLS = forge.tls.createConnection(
         {
            server: false,
            caStore: [],
            sessionCache: {},
            // supported cipher suites in order of preference
            //cipherSuites: [
            //   forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
            //   forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
            virtualHost: 'server',
            verify: function(c, verified, depth, certs)
            {
               console.log(
                  'TLS Client verifying certificate w/CN: \"' +
                  certs[0].subject.getField('CN').value +
                  '\", verified: ' + verified + '...');
               // accept any certificate from the server for this test
               return true;
            },
            connected: function(c)
            {
               console.log('Client connected...');
               
               // send message to server
               setTimeout(function()
               {
                  c.prepare('Hello Server');
               }, 1);
            },
            getCertificate: function(c, hint)
            {
               console.log('Client getting certificate ...');
               return cert;
            },
            getPrivateKey: function(c, cert)
            {
               return privateKey;
            },
            tlsDataReady: function(c)
            {
               // send base64-encoded TLS data to server
               //ws.send(forge.util.encode64(c.tlsData.getBytes()));
               //self.emit('connect');
               //debugger;
               self.write(c.tlsData.getBytes());
            },
            dataReady: function(c)
            {
               var response = c.data.getBytes();
               console.log('Client received \"' + response + '\"');
               //success = (response === 'Hello Client');
               //c.close();
            },
            closed: function(c)
            {
               console.log('Client disconnected.');
            },
            error: function(c, error)
            {
               console.log('Client error: ' + error.message);
            }
         });

         TLS.handshake();

    self._read();





      //self.emit('connect');
      //self.emit('ready');
    }
    else {
      self.emit('error', new Error("Unable to connect"));
    }
  });
};

net.Socket.prototype.destroy = function() {
  chrome.socket.disconnect(this._socketInfo.socketId);
  chrome.socket.destroy(this._socketInfo.socketId);
  clearTimeout(this._readTimer);
};
net.Socket.prototype.destroySoon = function() {
  // Blaine's solution to this stub - probably not correct impl
  chrome.socket.disconnect(this._socketInfo.socketId);
  clearTimeout(this._readTimer);
};

net.Socket.prototype.setEncoding = function(encoding) {
  this._encoding = encoding;
};

net.Socket.prototype.setNoDelay = function(noDelay) {
  noDelay = (noDelay === undefined) ? true : noDelay;
  chrome.socket.setNoDely(self._socketInfo.socketId, noDelay, function() {});
};

net.Socket.prototype.setKeepAlive = function(enable, delay) {
  enable = (enable === 'undefined') ? false : enable;
  delay = (delay === 'undefined') ? 0 : delay;
  chrome.socket.setKeepAlive(self._socketInfo.socketId, enable, initialDelay, function() {});
};

net.Socket.prototype._read = function() {
  var self = this;
  chrome.socket.read(self._socketInfo.socketId, function(readInfo) {
    if(readInfo.resultCode < 0) return;
    // ArrayBuffer to Buffer if no encoding.
    var buffer = arrayBufferToBuffer(readInfo.data);
    self.emit('data', buffer);
    if (self.ondata) self.ondata(buffer.parent, buffer.offset, buffer.offset + buffer.length);
  });

  // enque another read soon. TODO: Is there are better way to controll speed.
  self._readTimer = setTimeout(self._read.bind(self), 100);
};

net.Socket.prototype.write = function(data, encoding, callback) {
  var buffer;
  var self = this;

  encoding = encoding || "UTF8";
  callback = callback || function() {};

  if(typeof data === 'string') {
    buffer = stringToArrayBuffer(data);
  }
  else if(data instanceof Buffer) {
    buffer = bufferToArrayBuffer(data);
  }
  else {
    // throw an error because we can't do anything.
  }

  self._resetTimeout();

  chrome.socket.write(self._socketInfo.socketId, buffer, function(writeInfo) {
    callback();
  });

  return true;
};

net.Socket.prototype._resetTimeout = function() {
  var self = this;
  if(!!self._timeout == false) clearTimeout(self._timeout);
  if(!!self._timeoutValue) self._timeout = setTimeout(function() { self.emit('timeout') }, self._timeoutValue);
};

net.Socket.prototype.setTimeout = function(timeout, callback) {
  this._timeoutValue = timeout;
  this._resetTimeout();
};

net.Socket.prototype.ref = function() {};
net.Socket.prototype.unref = function() {};
net.Socket.prototype.pause = function() {};
net.Socket.prototype.resume = function() {};
net.Socket.prototype.end = function() {

};


Object.defineProperty(net.Socket.prototype, 'readyState', {
  get: function() {}
});

Object.defineProperty(net.Socket.prototype, 'bufferSize', {
  get: function() {}
});

})()
},{"events":1,"util":"+c0iQh","stream":4,"buffer":2}],5:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],1:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":5}],4:[function(require,module,exports){
var events = require('events');
var util = require('util');

function Stream() {
  events.EventEmitter.call(this);
}
util.inherits(Stream, events.EventEmitter);
module.exports = Stream;
// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once, and
  // only when all sources have ended.
  if (!dest._isStdio && (!options || options.end !== false)) {
    dest._pipeCount = dest._pipeCount || 0;
    dest._pipeCount++;

    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest._pipeCount--;

    // remove the listeners
    cleanup();

    if (dest._pipeCount > 0) {
      // waiting for other incoming streams to end.
      return;
    }

    dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (this.listeners('error').length === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('end', cleanup);
    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":1,"util":"+c0iQh"}],6:[function(require,module,exports){
// todo

},{}],7:[function(require,module,exports){
(function(){/*!
 * XRegExp All 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2012 MIT License
 */

// Module systems magic dance
;(function(definition) {
    // Don't turn on strict mode for this function, so it can assign to global
    var self;

    // RequireJS
    if (typeof define === 'function') {
        define(definition);
    // CommonJS
    } else if (typeof exports === 'object') {
        self = definition();
        // Use Node.js's `module.exports`. This supports both `require('xregexp')` and
        // `require('xregexp').XRegExp`
        (typeof module === 'object' ? (module.exports = self) : exports).XRegExp = self;
    // <script>
    } else {
        // Create global
        XRegExp = definition();
    }
}(function() {

/*!
 * XRegExp 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2007-2012 MIT License
 */

/**
 * XRegExp provides augmented, extensible regular expressions. You get new syntax, flags, and
 * methods beyond what browsers support natively. XRegExp is also a regex utility belt with tools
 * to make your client-side grepping simpler and more powerful, while freeing you from worrying
 * about pesky cross-browser inconsistencies and the dubious `lastIndex` property.
 */
var XRegExp = (function(undefined) {
    'use strict';

/* ==============================
 * Private variables
 * ============================== */

    var // ...

// Property name used for extended regex instance data
    REGEX_DATA = 'xregexp',

// Internal reference to the `XRegExp` object
    self,

// Optional features that can be installed and uninstalled
    features = {
        astral: false,
        natives: false
    },

// Store native methods to use and restore ('native' is an ES3 reserved keyword)
    nativ = {
        exec: RegExp.prototype.exec,
        test: RegExp.prototype.test,
        match: String.prototype.match,
        replace: String.prototype.replace,
        split: String.prototype.split
    },

// Storage for fixed/extended native methods
    fixed = {},

// Storage for regexes cached by `XRegExp.cache`
    cache = {},

// Storage for pattern details cached by the `XRegExp` constructor
    patternCache = {},

// Storage for regex syntax tokens added internally or by `XRegExp.addToken`
    tokens = [],

// Token scopes
    defaultScope = 'default',
    classScope = 'class',

// Regexes that match native regex syntax, including octals
    nativeTokens = {
        // Any native multicharacter token in default scope, or any single character
        'default': /\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,
        // Any native multicharacter token in character class scope, or any single character
        'class': /\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|[\s\S]/
    },

// Any backreference or dollar-prefixed character in replacement strings
    replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g,

// Check for correct `exec` handling of nonparticipating capturing groups
    correctExecNpcg = nativ.exec.call(/()??/, '')[1] === undefined,

// Check for flag y support
    hasNativeY = RegExp.prototype.sticky !== undefined,

// Tracker for known flags, including addon flags
    registeredFlags = {
        g: true,
        i: true,
        m: true,
        y: hasNativeY
    },

// Shortcut to `Object.prototype.toString`
    toString = {}.toString,

// Shortcut to `XRegExp.addToken`
    add;

/* ==============================
 * Private functions
 * ============================== */

/**
 * Attaches named capture data and `XRegExp.prototype` properties to a regex object.
 * @private
 * @param {RegExp} regex Regex to augment.
 * @param {Array} captureNames Array with capture names, or `null`.
 * @param {Boolean} [addProto=false] Whether to attach `XRegExp.prototype` properties. Not
 *   attaching properties avoids a minor performance penalty.
 * @returns {RegExp} Augmented regex.
 */
    function augment(regex, captureNames, addProto) {
        var p;

        if (addProto) {
            // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value
            if (regex.__proto__) {
                regex.__proto__ = self.prototype;
            } else {
                for (p in self.prototype) {
                    // A `self.prototype.hasOwnProperty(p)` check wouldn't be worth it here, since
                    // this is performance sensitive, and enumerable `Object.prototype` or
                    // `RegExp.prototype` extensions exist on `regex.prototype` anyway
                    regex[p] = self.prototype[p];
                }
            }
        }

        regex[REGEX_DATA] = {captureNames: captureNames};

        return regex;
    }

/**
 * Removes any duplicate characters from the provided string.
 * @private
 * @param {String} str String to remove duplicate characters from.
 * @returns {String} String with any duplicate characters removed.
 */
    function clipDuplicates(str) {
        return nativ.replace.call(str, /([\s\S])(?=[\s\S]*\1)/g, '');
    }

/**
 * Copies a regex object while preserving special properties for named capture and augmenting with
 * `XRegExp.prototype` methods. The copy has a fresh `lastIndex` property (set to zero). Allows
 * adding and removing native flags while copying the regex.
 * @private
 * @param {RegExp} regex Regex to copy.
 * @param {Object} [options] Allows specifying native flags to add or remove while copying the
 *   regex, and whether to attach `XRegExp.prototype` properties.
 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
 */
    function copy(regex, options) {
        if (!self.isRegExp(regex)) {
            throw new TypeError('Type RegExp expected');
        }

        // Get native flags in use
        var flags = nativ.exec.call(/\/([a-z]*)$/i, String(regex))[1];
        options = options || {};

        if (options.add) {
            flags = clipDuplicates(flags + options.add);
        }

        if (options.remove) {
            // Would need to escape `options.remove` if this was public
            flags = nativ.replace.call(flags, new RegExp('[' + options.remove + ']+', 'g'), '');
        }

        // Augment with `XRegExp.prototype` methods, but use the native `RegExp` constructor and
        // avoid searching for special tokens. That would be wrong for regexes constructed by
        // `RegExp`, and unnecessary for regexes constructed by `XRegExp` because the regex has
        // already undergone the translation to native regex syntax
        regex = augment(
            new RegExp(regex.source, flags),
            hasNamedCapture(regex) ? regex[REGEX_DATA].captureNames.slice(0) : null,
            options.addProto
        );

        return regex;
    }

/**
 * Returns a new copy of the object used to hold extended regex instance data, tailored for a
 * native nonaugmented regex.
 * @private
 * @returns {Object} Object with base regex instance data.
 */
    function getBaseProps() {
        return {captureNames: null};
    }

/**
 * Determines whether a regex has extended instance data used to track capture names.
 * @private
 * @param {RegExp} regex Regex to check.
 * @returns {Boolean} Whether the regex uses named capture.
 */
    function hasNamedCapture(regex) {
        return !!(regex[REGEX_DATA] && regex[REGEX_DATA].captureNames);
    }

/**
 * Returns the first index at which a given value can be found in an array.
 * @private
 * @param {Array} array Array to search.
 * @param {*} value Value to locate in the array.
 * @returns {Number} Zero-based index at which the item is found, or -1.
 */
    function indexOf(array, value) {
        // Use the native array method, if available
        if (Array.prototype.indexOf) {
            return array.indexOf(value);
        }

        var len = array.length, i;

        // Not a very good shim, but good enough for XRegExp's use of it
        for (i = 0; i < len; ++i) {
            if (array[i] === value) {
                return i;
            }
        }

        return -1;
    }

/**
 * Determines whether a value is of the specified type, by resolving its internal [[Class]].
 * @private
 * @param {*} value Object to check.
 * @param {String} type Type to check for, in TitleCase.
 * @returns {Boolean} Whether the object matches the type.
 */
    function isType(value, type) {
        return toString.call(value) === '[object ' + type + ']';
    }

/**
 * Checks whether the next nonignorable token after the specified position is a quantifier.
 * @private
 * @param {String} pattern Pattern to search within.
 * @param {Number} pos Index in `pattern` to search at.
 * @param {String} flags Flags used by the pattern.
 * @returns {Boolean} Whether the next token is a quantifier.
 */
    function isQuantifierNext(pattern, pos, flags) {
        return nativ.test.call(
            flags.indexOf('x') > -1 ?
                // Ignore any leading whitespace, line comments, and inline comments
                /^(?:\s+|#.*|\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/ :
                // Ignore any leading inline comments
                /^(?:\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/,
            pattern.slice(pos)
        );
    }

/**
 * Checks for flag-related errors, and strips/applies flags in a leading mode modifier. Offloads
 * the flag preparation logic from the `XRegExp` constructor.
 * @private
 * @param {String} pattern Regex pattern, possibly with a leading mode modifier.
 * @param {String} flags Any combination of flags.
 * @returns {Object} Object with properties `pattern` and `flags`.
 */
    function prepareFlags(pattern, flags) {
        var i;

        // Recent browsers throw on duplicate flags, so copy this behavior for nonnative flags
        if (clipDuplicates(flags) !== flags) {
            throw new SyntaxError('Invalid duplicate regex flag ' + flags);
        }

        // Strip and apply a leading mode modifier with any combination of flags except g or y
        pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function($0, $1) {
            if (nativ.test.call(/[gy]/, $1)) {
                throw new SyntaxError('Cannot use flag g or y in mode modifier ' + $0);
            }
            // Allow duplicate flags within the mode modifier
            flags = clipDuplicates(flags + $1);
            return '';
        });

        // Throw on unknown native or nonnative flags
        for (i = 0; i < flags.length; ++i) {
            if (!registeredFlags[flags.charAt(i)]) {
                throw new SyntaxError('Unknown regex flag ' + flags.charAt(i));
            }
        }

        return {
            pattern: pattern,
            flags: flags
        };
    }

/**
 * Prepares an options object from the given value.
 * @private
 * @param {String|Object} value Value to convert to an options object.
 * @returns {Object} Options object.
 */
    function prepareOptions(value) {
        value = value || {};

        if (isType(value, 'String')) {
            value = self.forEach(value, /[^\s,]+/, function(match) {
                this[match] = true;
            }, {});
        }

        return value;
    }

/**
 * Registers a flag so it doesn't throw an 'unknown flag' error.
 * @private
 * @param {String} flag Single-character flag to register.
 */
    function registerFlag(flag) {
        if (!/^[\w$]$/.test(flag)) {
            throw new Error('Flag must be a single character A-Za-z0-9_$');
        }

        registeredFlags[flag] = true;
    }

/**
 * Runs built-in and custom regex syntax tokens in reverse insertion order at the specified
 * position, until a match is found.
 * @private
 * @param {String} pattern Original pattern from which an XRegExp object is being built.
 * @param {String} flags Flags being used to construct the regex.
 * @param {Number} pos Position to search for tokens within `pattern`.
 * @param {Number} scope Regex scope to apply: 'default' or 'class'.
 * @param {Object} context Context object to use for token handler functions.
 * @returns {Object} Object with properties `matchLength`, `output`, and `reparse`; or `null`.
 */
    function runTokens(pattern, flags, pos, scope, context) {
        var i = tokens.length,
            result = null,
            match,
            t;

        // Run in reverse insertion order
        while (i--) {
            t = tokens[i];
            if (
                (t.scope === scope || t.scope === 'all') &&
                (!t.flag || flags.indexOf(t.flag) > -1)
            ) {
                match = self.exec(pattern, t.regex, pos, 'sticky');
                if (match) {
                    result = {
                        matchLength: match[0].length,
                        output: t.handler.call(context, match, scope, flags),
                        reparse: t.reparse
                    };
                    // Finished with token tests
                    break;
                }
            }
        }

        return result;
    }

/**
 * Enables or disables implicit astral mode opt-in.
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
    function setAstral(on) {
        // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and
        // flags might now produce different results
        self.cache.flush('patterns');

        features.astral = on;
    }

/**
 * Enables or disables native method overrides.
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
    function setNatives(on) {
        RegExp.prototype.exec = (on ? fixed : nativ).exec;
        RegExp.prototype.test = (on ? fixed : nativ).test;
        String.prototype.match = (on ? fixed : nativ).match;
        String.prototype.replace = (on ? fixed : nativ).replace;
        String.prototype.split = (on ? fixed : nativ).split;

        features.natives = on;
    }

/**
 * Returns the object, or throws an error if it is `null` or `undefined`. This is used to follow
 * the ES5 abstract operation `ToObject`.
 * @private
 * @param {*} value Object to check and return.
 * @returns {*} The provided object.
 */
    function toObject(value) {
        // This matches both `null` and `undefined`
        if (value == null) {
            throw new TypeError('Cannot convert null or undefined to object');
        }

        return value;
    }

/* ==============================
 * Constructor
 * ============================== */

/**
 * Creates an extended regular expression object for matching text with a pattern. Differs from a
 * native regular expression in that additional syntax and flags are supported. The returned object
 * is in fact a native `RegExp` and works with all native methods.
 * @class XRegExp
 * @constructor
 * @param {String|RegExp} pattern Regex pattern string, or an existing regex object to copy.
 * @param {String} [flags] Any combination of flags.
 *   Native flags:
 *     <li>`g` - global
 *     <li>`i` - ignore case
 *     <li>`m` - multiline anchors
 *     <li>`y` - sticky (Firefox 3+)
 *   Additional XRegExp flags:
 *     <li>`n` - explicit capture
 *     <li>`s` - dot matches all (aka singleline)
 *     <li>`x` - free-spacing and line comments (aka extended)
 *     <li>`A` - astral (requires the Unicode Base addon)
 *   Flags cannot be provided when constructing one `RegExp` from another.
 * @returns {RegExp} Extended regular expression object.
 * @example
 *
 * // With named capture and flag x
 * XRegExp('(?<year>  [0-9]{4} ) -?  # year  \n\
 *          (?<month> [0-9]{2} ) -?  # month \n\
 *          (?<day>   [0-9]{2} )     # day   ', 'x');
 *
 * // Providing a regex object copies it. Native regexes are recompiled using native (not XRegExp)
 * // syntax. Copies maintain special properties for named capture, are augmented with
 * // `XRegExp.prototype` methods, and have fresh `lastIndex` properties (set to zero).
 * XRegExp(/regex/);
 */
    self = function(pattern, flags) {
        var context = {
                hasNamedCapture: false,
                captureNames: []
            },
            scope = defaultScope,
            output = '',
            pos = 0,
            result,
            token,
            key;

        if (self.isRegExp(pattern)) {
            if (flags !== undefined) {
                throw new TypeError('Cannot supply flags when copying a RegExp');
            }
            return copy(pattern, {addProto: true});
        }

        // Copy the argument behavior of `RegExp`
        pattern = pattern === undefined ? '' : String(pattern);
        flags = flags === undefined ? '' : String(flags);

        // Cache-lookup key
        key = pattern + '/' + flags;

        if (!patternCache[key]) {
            // Check for flag-related errors, and strip/apply flags in a leading mode modifier
            result = prepareFlags(pattern, flags);
            pattern = result.pattern;
            flags = result.flags;

            // Use XRegExp's syntax tokens to translate the pattern to a native regex pattern...
            // `pattern.length` may change on each iteration, if tokens use the `reparse` option
            while (pos < pattern.length) {
                do {
                    // Check for custom tokens at the current position
                    result = runTokens(pattern, flags, pos, scope, context);
                    // If the matched token used the `reparse` option, splice its output into the
                    // pattern before running tokens again at the same position
                    if (result && result.reparse) {
                        pattern = pattern.slice(0, pos) +
                            result.output +
                            pattern.slice(pos + result.matchLength);
                    }
                } while (result && result.reparse);

                if (result) {
                    output += result.output;
                    pos += (result.matchLength || 1);
                } else {
                    // Get the native token at the current position
                    token = self.exec(pattern, nativeTokens[scope], pos, 'sticky')[0];
                    output += token;
                    pos += token.length;
                    if (token === '[' && scope === defaultScope) {
                        scope = classScope;
                    } else if (token === ']' && scope === classScope) {
                        scope = defaultScope;
                    }
                }
            }

            patternCache[key] = {
                // Cleanup token cruft: repeated `(?:)(?:)` and leading/trailing `(?:)`
                pattern: nativ.replace.call(output, /\(\?:\)(?=\(\?:\))|^\(\?:\)|\(\?:\)$/g, ''),
                // Strip all but native flags
                flags: nativ.replace.call(flags, /[^gimy]+/g, ''),
                // `context.captureNames` has an item for each capturing group, even if unnamed
                captures: context.hasNamedCapture ? context.captureNames : null
            }
        }

        key = patternCache[key];
        return augment(new RegExp(key.pattern, key.flags), key.captures, /*addProto*/ true);
    };

// Add `RegExp.prototype` to the prototype chain
    self.prototype = new RegExp;

/* ==============================
 * Public properties
 * ============================== */

/**
 * The XRegExp version number.
 * @static
 * @memberOf XRegExp
 * @type String
 */
    self.version = '3.0.0-pre';

/* ==============================
 * Public methods
 * ============================== */

/**
 * Extends XRegExp syntax and allows custom flags. This is used internally and can be used to
 * create XRegExp addons. If more than one token can match the same string, the last added wins.
 * @memberOf XRegExp
 * @param {RegExp} regex Regex object that matches the new token.
 * @param {Function} handler Function that returns a new pattern string (using native regex syntax)
 *   to replace the matched token within all future XRegExp regexes. Has access to persistent
 *   properties of the regex being built, through `this`. Invoked with three arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The regex scope where the match was found: 'default' or 'class'.
 *   <li>The flags used by the regex, including any flags in a leading mode modifier.
 *   The handler function becomes part of the XRegExp construction process, so be careful not to
 *   construct XRegExps within the function or you will trigger infinite recursion.
 * @param {Object} [options] Options object with optional properties:
 *   <li>`scope` {String} Scope where the token applies: 'default', 'class', or 'all'.
 *   <li>`flag` {String} Single-character flag that triggers the token. This also registers the
 *     flag, which prevents XRegExp from throwing an 'unknown flag' error when the flag is used.
 *   <li>`optionalFlags` {String} Any custom flags checked for within the token `handler` that are
 *     not required to trigger the token. This registers the flags, to prevent XRegExp from
 *     throwing an 'unknown flag' error when any of the flags are used.
 *   <li>`reparse` {Boolean} Whether the `handler` function's output should not be treated as
 *     final, and instead be reparseable by other tokens (including the current token). Allows
 *     token chaining or deferring.
 * @example
 *
 * // Basic usage: Add \a for the ALERT control code
 * XRegExp.addToken(
 *   /\\a/,
 *   function() {return '\\x07';},
 *   {scope: 'all'}
 * );
 * XRegExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
 *
 * // Add the U (ungreedy) flag from PCRE and RE2, which reverses greedy and lazy quantifiers
 * XRegExp.addToken(
 *   /([?*+]|{\d+(?:,\d*)?})(\??)/,
 *   function(match) {return match[1] + (match[2] ? '' : '?');},
 *   {flag: 'U'}
 * );
 * XRegExp('a+', 'U').exec('aaa')[0]; // -> 'a'
 * XRegExp('a+?', 'U').exec('aaa')[0]; // -> 'aaa'
 */
    self.addToken = function(regex, handler, options) {
        options = options || {};
        var optionalFlags = options.optionalFlags, i;

        if (options.flag) {
            registerFlag(options.flag);
        }

        if (optionalFlags) {
            optionalFlags = nativ.split.call(optionalFlags, '');
            for (i = 0; i < optionalFlags.length; ++i) {
                registerFlag(optionalFlags[i]);
            }
        }

        // Add to the private list of syntax tokens
        tokens.push({
            regex: copy(regex, {add: 'g' + (hasNativeY ? 'y' : '')}),
            handler: handler,
            scope: options.scope || defaultScope,
            flag: options.flag,
            reparse: options.reparse
        });

        // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and
        // flags might now produce different results
        self.cache.flush('patterns');
    };

/**
 * Caches and returns the result of calling `XRegExp(pattern, flags)`. On any subsequent call with
 * the same pattern and flag combination, the cached copy of the regex is returned.
 * @memberOf XRegExp
 * @param {String} pattern Regex pattern string.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Cached XRegExp object.
 * @example
 *
 * while (match = XRegExp.cache('.', 'gs').exec(str)) {
 *   // The regex is compiled once only
 * }
 */
    self.cache = function(pattern, flags) {
        var key = pattern + '/' + (flags || '');
        return cache[key] || (cache[key] = self(pattern, flags));
    };

// Intentionally undocumented
    self.cache.flush = function(cacheName) {
        if (cacheName === 'patterns') {
            // Flush the pattern cache used by the `XRegExp` constructor
            patternCache = {};
        } else {
            // Flush the regex object cache populated by `XRegExp.cache`
            cache = {};
        }
    };

/**
 * Escapes any regular expression metacharacters, for use when matching literal strings. The result
 * can safely be used at any point within a regex that uses any flags.
 * @memberOf XRegExp
 * @param {String} str String to escape.
 * @returns {String} String with regex metacharacters escaped.
 * @example
 *
 * XRegExp.escape('Escaped? <.>');
 * // -> 'Escaped\?\ <\.>'
 */
    self.escape = function(str) {
        return nativ.replace.call(toObject(str), /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    };

/**
 * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
 * regex uses named capture, named backreference properties are included on the match array.
 * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
 * must start at the specified position only. The `lastIndex` property of the provided regex is not
 * used, but is updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.exec` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Array} Match array with named backreference properties, or `null`.
 * @example
 *
 * // Basic use, with named backreference
 * var match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
 * match.hex; // -> '2620'
 *
 * // With pos and sticky, in a loop
 * var pos = 2, result = [], match;
 * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
 *   result.push(match[1]);
 *   pos = match.index + match[0].length;
 * }
 * // result -> ['2', '3', '4']
 */
    self.exec = function(str, regex, pos, sticky) {
        var cacheFlags = 'g', match, r2;

        if (hasNativeY && (sticky || (regex.sticky && sticky !== false))) {
            cacheFlags += 'y';
        }

        regex[REGEX_DATA] = regex[REGEX_DATA] || getBaseProps();

        // Shares cached copies with `XRegExp.match`/`replace`
        r2 = regex[REGEX_DATA][cacheFlags] || (
            regex[REGEX_DATA][cacheFlags] = copy(regex, {
                add: cacheFlags,
                remove: sticky === false ? 'y' : ''
            })
        );

        r2.lastIndex = pos = pos || 0;

        // Fixed `exec` required for `lastIndex` fix, named backreferences, etc.
        match = fixed.exec.call(r2, str);

        if (sticky && match && match.index !== pos) {
            match = null;
        }

        if (regex.global) {
            regex.lastIndex = match ? r2.lastIndex : 0;
        }

        return match;
    };

/**
 * Executes a provided function once per regex match.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Function} callback Function to execute for each match. Invoked with four arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The zero-based match index.
 *   <li>The string being traversed.
 *   <li>The regex object being used to traverse the string.
 * @param {*} [context] Object to use as `this` when executing `callback`.
 * @returns {*} Provided `context` object.
 * @example
 *
 * // Extracts every other digit from a string
 * XRegExp.forEach('1a2345', /\d/, function(match, i) {
 *   if (i % 2) this.push(+match[0]);
 * }, []);
 * // -> [2, 4]
 */
    self.forEach = function(str, regex, callback, context) {
        var pos = 0,
            i = -1,
            match;

        while ((match = self.exec(str, regex, pos))) {
            // Because `regex` is provided to `callback`, the function can use the deprecated/
            // nonstandard `RegExp.prototype.compile` to mutate the regex. However, since
            // `XRegExp.exec` doesn't use `lastIndex` to set the search position, this can't lead
            // to an infinite loop, at least. Actually, because of the way `XRegExp.exec` caches
            // globalized versions of regexes, mutating the regex will not have any effect on the
            // iteration or matched strings, which is a nice side effect that brings extra safety
            callback.call(context, match, ++i, str, regex);

            pos = match.index + (match[0].length || 1);
        }

        return context;
    };

/**
 * Copies a regex object and adds flag `g`. The copy maintains special properties for named
 * capture, is augmented with `XRegExp.prototype` methods, and has a fresh `lastIndex` property
 * (set to zero). Native regexes are not recompiled using XRegExp syntax.
 * @memberOf XRegExp
 * @param {RegExp} regex Regex to globalize.
 * @returns {RegExp} Copy of the provided regex with flag `g` added.
 * @example
 *
 * var globalCopy = XRegExp.globalize(/regex/);
 * globalCopy.global; // -> true
 */
    self.globalize = function(regex) {
        return copy(regex, {add: 'g', addProto: true});
    };

/**
 * Installs optional features according to the specified options. Can be undone using
 * {@link #XRegExp.uninstall}.
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.install({
 *   // Enables support for astral code points in Unicode addons (implicitly sets flag A)
 *   astral: true,
 *
 *   // Overrides native regex methods with fixed/extended versions that support named
 *   // backreferences and fix numerous cross-browser bugs
 *   natives: true
 * });
 *
 * // With an options string
 * XRegExp.install('astral natives');
 */
    self.install = function(options) {
        options = prepareOptions(options);

        if (!features.astral && options.astral) {
            setAstral(true);
        }

        if (!features.natives && options.natives) {
            setNatives(true);
        }
    };

/**
 * Checks whether an individual optional feature is installed.
 * @memberOf XRegExp
 * @param {String} feature Name of the feature to check. One of:
 *   <li>`natives`
 *   <li>`astral`
 * @returns {Boolean} Whether the feature is installed.
 * @example
 *
 * XRegExp.isInstalled('natives');
 */
    self.isInstalled = function(feature) {
        return !!(features[feature]);
    };

/**
 * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
 * created in another frame, when `instanceof` and `constructor` checks would fail.
 * @memberOf XRegExp
 * @param {*} value Object to check.
 * @returns {Boolean} Whether the object is a `RegExp` object.
 * @example
 *
 * XRegExp.isRegExp('string'); // -> false
 * XRegExp.isRegExp(/regex/i); // -> true
 * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
 * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
 */
    self.isRegExp = function(value) {
        return toString.call(value) === '[object RegExp]';
        //return isType(value, 'RegExp');
    };

/**
 * Returns the first matched string, or in global mode, an array containing all matched strings.
 * This is essentially a more convenient re-implementation of `String.prototype.match` that gives
 * the result types you actually want (string instead of `exec`-style array in match-first mode,
 * and an empty array instead of `null` when no matches are found in match-all mode). It also lets
 * you override flag g and ignore `lastIndex`, and fixes browser bugs.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {String} [scope='one'] Use 'one' to return the first match as a string. Use 'all' to
 *   return an array of all matched strings. If not explicitly specified and `regex` uses flag g,
 *   `scope` is 'all'.
 * @returns {String|Array} In match-first mode: First match as a string, or `null`. In match-all
 *   mode: Array of all matched strings, or an empty array.
 * @example
 *
 * // Match first
 * XRegExp.match('abc', /\w/); // -> 'a'
 * XRegExp.match('abc', /\w/g, 'one'); // -> 'a'
 * XRegExp.match('abc', /x/g, 'one'); // -> null
 *
 * // Match all
 * XRegExp.match('abc', /\w/g); // -> ['a', 'b', 'c']
 * XRegExp.match('abc', /\w/, 'all'); // -> ['a', 'b', 'c']
 * XRegExp.match('abc', /x/, 'all'); // -> []
 */
    self.match = function(str, regex, scope) {
        var global = (regex.global && scope !== 'one') || scope === 'all',
            cacheFlags = (global ? 'g' : '') + (regex.sticky ? 'y' : ''),
            result,
            r2;

        regex[REGEX_DATA] = regex[REGEX_DATA] || getBaseProps();

        // Shares cached copies with `XRegExp.exec`/`replace`
        r2 = regex[REGEX_DATA][cacheFlags || 'noGY'] || (
            regex[REGEX_DATA][cacheFlags || 'noGY'] = copy(regex, {
                add: cacheFlags,
                remove: scope === 'one' ? 'g' : ''
            })
        );

        result = nativ.match.call(toObject(str), r2);

        if (regex.global) {
            regex.lastIndex = (
                (scope === 'one' && result) ?
                    // Can't use `r2.lastIndex` since `r2` is nonglobal in this case
                    (result.index + result[0].length) : 0
            );
        }

        return global ? (result || []) : (result && result[0]);
    };

/**
 * Retrieves the matches from searching a string using a chain of regexes that successively search
 * within previous matches. The provided `chain` array can contain regexes and objects with `regex`
 * and `backref` properties. When a backreference is specified, the named or numbered backreference
 * is passed forward to the next regex or returned.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {Array} chain Regexes that each search for matches within preceding results.
 * @returns {Array} Matches by the last regex in the chain, or an empty array.
 * @example
 *
 * // Basic usage; matches numbers within <b> tags
 * XRegExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
 *   XRegExp('(?is)<b>.*?</b>'),
 *   /\d+/
 * ]);
 * // -> ['2', '4', '56']
 *
 * // Passing forward and returning specific backreferences
 * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
 *         <a href="http://www.google.com/">Google</a>';
 * XRegExp.matchChain(html, [
 *   {regex: /<a href="([^"]+)">/i, backref: 1},
 *   {regex: XRegExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
 * ]);
 * // -> ['xregexp.com', 'www.google.com']
 */
    self.matchChain = function(str, chain) {
        return (function recurseChain(values, level) {
            var item = chain[level].regex ? chain[level] : {regex: chain[level]},
                matches = [],
                addMatch = function(match) {
                    if (item.backref) {
                        /* Safari 4.0.5 (but not 5.0.5+) inappropriately uses sparse arrays to hold
                         * the `undefined`s for backreferences to nonparticipating capturing
                         * groups. In such cases, a `hasOwnProperty` or `in` check on its own would
                         * inappropriately throw the exception, so also check if the backreference
                         * is a number that is within the bounds of the array.
                         */
                        if (!(match.hasOwnProperty(item.backref) || +item.backref < match.length)) {
                            throw new ReferenceError('Backreference to undefined group: ' + item.backref);
                        }

                        matches.push(match[item.backref] || '');
                    } else {
                        matches.push(match[0]);
                    }
                },
                i;

            for (i = 0; i < values.length; ++i) {
                self.forEach(values[i], item.regex, addMatch);
            }

            return ((level === chain.length - 1) || !matches.length) ?
                matches :
                recurseChain(matches, level + 1);
        }([str], 0));
    };

/**
 * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
 * or regex, and the replacement can be a string or a function to be called for each match. To
 * perform a global search and replace, use the optional `scope` argument or include flag g if
 * using a regex. Replacement strings can use `${n}` for named and numbered backreferences.
 * Replacement functions can use named backreferences via `arguments[0].name`. Also fixes browser
 * bugs compared to the native `String.prototype.replace` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 *   Replacement strings can include special replacement syntax:
 *     <li>$$ - Inserts a literal $ character.
 *     <li>$&, $0 - Inserts the matched substring.
 *     <li>$` - Inserts the string that precedes the matched substring (left context).
 *     <li>$' - Inserts the string that follows the matched substring (right context).
 *     <li>$n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
 *       backreference n/nn.
 *     <li>${n} - Where n is a name or any number of digits that reference an existent capturing
 *       group, inserts backreference n.
 *   Replacement functions are invoked with three or more arguments:
 *     <li>The matched substring (corresponds to $& above). Named backreferences are accessible as
 *       properties of this first argument.
 *     <li>0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
 *     <li>The zero-based index of the match within the total search string.
 *     <li>The total string being searched.
 * @param {String} [scope='one'] Use 'one' to replace the first match only, or 'all'. If not
 *   explicitly specified and using a regex with flag g, `scope` is 'all'.
 * @returns {String} New string with one or all matches replaced.
 * @example
 *
 * // Regex search, using named backreferences in replacement string
 * var name = XRegExp('(?<first>\\w+) (?<last>\\w+)');
 * XRegExp.replace('John Smith', name, '${last}, ${first}');
 * // -> 'Smith, John'
 *
 * // Regex search, using named backreferences in replacement function
 * XRegExp.replace('John Smith', name, function(match) {
 *   return match.last + ', ' + match.first;
 * });
 * // -> 'Smith, John'
 *
 * // String search, with replace-all
 * XRegExp.replace('RegExp builds RegExps', 'RegExp', 'XRegExp', 'all');
 * // -> 'XRegExp builds XRegExps'
 */
    self.replace = function(str, search, replacement, scope) {
        var isRegex = self.isRegExp(search),
            global = (search.global && scope !== 'one') || scope === 'all',
            cacheFlags = (global ? 'g' : '') + (search.sticky ? 'y' : ''),
            s2 = search,
            result;

        if (isRegex) {
            search[REGEX_DATA] = search[REGEX_DATA] || getBaseProps();

            // Shares cached copies with `XRegExp.exec`/`match`. Since a copy is used,
            // `search`'s `lastIndex` isn't updated *during* replacement iterations
            s2 = search[REGEX_DATA][cacheFlags || 'noGY'] || (
                search[REGEX_DATA][cacheFlags || 'noGY'] = copy(search, {
                    add: cacheFlags,
                    remove: scope === 'one' ? 'g' : ''
                })
            );
        } else if (global) {
            s2 = new RegExp(self.escape(String(search)), 'g');
        }

        // Fixed `replace` required for named backreferences, etc.
        result = fixed.replace.call(toObject(str), s2, replacement);

        if (isRegex && search.global) {
            // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
            search.lastIndex = 0;
        }

        return result;
    };

/**
 * Performs batch processing of string replacements. Used like {@link #XRegExp.replace}, but
 * accepts an array of replacement details. Later replacements operate on the output of earlier
 * replacements. Replacement details are accepted as an array with a regex or string to search for,
 * the replacement string or function, and an optional scope of 'one' or 'all'. Uses the XRegExp
 * replacement text syntax, which supports named backreference properties via `${name}`.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {Array} replacements Array of replacement detail arrays.
 * @returns {String} New string with all replacements.
 * @example
 *
 * str = XRegExp.replaceEach(str, [
 *   [XRegExp('(?<name>a)'), 'z${name}'],
 *   [/b/gi, 'y'],
 *   [/c/g, 'x', 'one'], // scope 'one' overrides /g
 *   [/d/, 'w', 'all'],  // scope 'all' overrides lack of /g
 *   ['e', 'v', 'all'],  // scope 'all' allows replace-all for strings
 *   [/f/g, function($0) {
 *     return $0.toUpperCase();
 *   }]
 * ]);
 */
    self.replaceEach = function(str, replacements) {
        var i, r;

        for (i = 0; i < replacements.length; ++i) {
            r = replacements[i];
            str = self.replace(str, r[0], r[1], r[2]);
        }

        return str;
    };

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * XRegExp.split('a b c', ' ');
 * // -> ['a', 'b', 'c']
 *
 * // With limit
 * XRegExp.split('a b c', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * XRegExp.split('..word1..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', '..']
 */
    self.split = function(str, separator, limit) {
        return fixed.split.call(toObject(str), separator, limit);
    };

/**
 * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
 * `sticky` arguments specify the search start position, and whether the match must start at the
 * specified position only. The `lastIndex` property of the provided regex is not used, but is
 * updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.test` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Boolean} Whether the regex matched the provided value.
 * @example
 *
 * // Basic use
 * XRegExp.test('abc', /c/); // -> true
 *
 * // With pos and sticky
 * XRegExp.test('abc', /c/, 0, 'sticky'); // -> false
 */
    self.test = function(str, regex, pos, sticky) {
        // Do this the easy way :-)
        return !!self.exec(str, regex, pos, sticky);
    };

/**
 * Uninstalls optional features according to the specified options. All optional features start out
 * uninstalled, so this is used to undo the actions of {@link #XRegExp.install}.
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.uninstall({
 *   // Disables support for astral code points in Unicode addons
 *   astral: true,
 *
 *   // Restores native regex methods
 *   natives: true
 * });
 *
 * // With an options string
 * XRegExp.uninstall('astral natives');
 */
    self.uninstall = function(options) {
        options = prepareOptions(options);

        if (features.astral && options.astral) {
            setAstral(false);
        }

        if (features.natives && options.natives) {
            setNatives(false);
        }
    };

/**
 * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
 * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
 * Backreferences in provided regex objects are automatically renumbered to work correctly. Native
 * flags used by provided regexes are ignored in favor of the `flags` argument.
 * @memberOf XRegExp
 * @param {Array} patterns Regexes and strings to combine.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Union of the provided regexes and strings.
 * @example
 *
 * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
 * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
 */
    self.union = function(patterns, flags) {
        var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
            output = [],
            numCaptures = 0,
            numPriorCaptures,
            captureNames,
            pattern,
            rewrite = function(match, paren, backref) {
                var name = captureNames[numCaptures - numPriorCaptures];

                // Capturing group
                if (paren) {
                    ++numCaptures;
                    // If the current capture has a name, preserve the name
                    if (name) {
                        return '(?<' + name + '>';
                    }
                // Backreference
                } else if (backref) {
                    // Rewrite the backreference
                    return '\\' + (+backref + numPriorCaptures);
                }

                return match;
            },
            i;

        if (!(isType(patterns, 'Array') && patterns.length)) {
            throw new TypeError('Must provide a nonempty array of patterns to merge');
        }

        for (i = 0; i < patterns.length; ++i) {
            pattern = patterns[i];

            if (self.isRegExp(pattern)) {
                numPriorCaptures = numCaptures;
                captureNames = (pattern[REGEX_DATA] && pattern[REGEX_DATA].captureNames) || [];

                // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns
                // are independently valid; helps keep this simple. Named captures are put back
                output.push(self(pattern.source).source.replace(parts, rewrite));
            } else {
                output.push(self.escape(pattern));
            }
        }

        return self(output.join('|'), flags);
    };

/* ==============================
 * Fixed/extended native methods
 * ============================== */

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `RegExp.prototype.exec`. Calling `XRegExp.install('natives')` uses this to
 * override the native method. Use via `XRegExp.exec` without overriding natives.
 * @private
 * @param {String} str String to search.
 * @returns {Array} Match array with named backreference properties, or `null`.
 */
    fixed.exec = function(str) {
        var origLastIndex = this.lastIndex,
            match = nativ.exec.apply(this, arguments),
            name,
            r2,
            i;

        if (match) {
            // Fix browsers whose `exec` methods don't return `undefined` for nonparticipating
            // capturing groups. This fixes IE 5.5-8, but not IE 9's quirks mode or emulation of
            // older IEs. IE 9 in standards mode follows the spec
            if (!correctExecNpcg && match.length > 1 && indexOf(match, '') > -1) {
                r2 = copy(this, {remove: 'g'});
                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
                // matching due to characters outside the match
                nativ.replace.call(String(str).slice(match.index), r2, function() {
                    var len = arguments.length, i;
                    // Skip index 0 and the last 2
                    for (i = 1; i < len - 2; ++i) {
                        if (arguments[i] === undefined) {
                            match[i] = undefined;
                        }
                    }
                });
            }

            // Attach named capture properties
            if (this[REGEX_DATA] && this[REGEX_DATA].captureNames) {
                // Skip index 0
                for (i = 1; i < match.length; ++i) {
                    name = this[REGEX_DATA].captureNames[i - 1];
                    /* Only set match[name] if it hasn't already been defined
                     * when we're using a capture name more than once.
                     *   - Brian White
                     */
                    if (name && match[name] === undefined) {
                        match[name] = match[i];
                    }
                }
            }

            // Fix browsers that increment `lastIndex` after zero-length matches
            if (this.global && !match[0].length && (this.lastIndex > match.index)) {
                this.lastIndex = match.index;
            }
        }

        if (!this.global) {
            // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
            this.lastIndex = origLastIndex;
        }

        return match;
    };

/**
 * Fixes browser bugs in the native `RegExp.prototype.test`. Calling `XRegExp.install('natives')`
 * uses this to override the native method.
 * @private
 * @param {String} str String to search.
 * @returns {Boolean} Whether the regex matched the provided value.
 */
    fixed.test = function(str) {
        // Do this the easy way :-)
        return !!fixed.exec.call(this, str);
    };

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `String.prototype.match`. Calling `XRegExp.install('natives')` uses this to
 * override the native method.
 * @private
 * @param {RegExp|*} regex Regex to search with. If not a regex object, it is passed to `RegExp`.
 * @returns {Array} If `regex` uses flag g, an array of match strings or `null`. Without flag g,
 *   the result of calling `regex.exec(this)`.
 */
    fixed.match = function(regex) {
        var result;

        if (!self.isRegExp(regex)) {
            // Use the native `RegExp` rather than `XRegExp`
            regex = new RegExp(regex);
        } else if (regex.global) {
            result = nativ.match.apply(this, arguments);
            // Fixes IE bug
            regex.lastIndex = 0;

            return result;
        }

        return fixed.exec.call(regex, toObject(this));
    };

/**
 * Adds support for `${n}` tokens for named and numbered backreferences in replacement text, and
 * provides named backreferences to replacement functions as `arguments[0].name`. Also fixes
 * browser bugs in replacement text syntax when performing a replacement using a nonregex search
 * value, and the value of a replacement regex's `lastIndex` property during replacement iterations
 * and upon completion. Note that this doesn't support SpiderMonkey's proprietary third (`flags`)
 * argument. Calling `XRegExp.install('natives')` uses this to override the native method. Use via
 * `XRegExp.replace` without overriding natives.
 * @private
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 * @returns {String} New string with one or all matches replaced.
 */
    fixed.replace = function(search, replacement) {
        var isRegex = self.isRegExp(search),
            origLastIndex,
            captureNames,
            result;

        if (isRegex) {
            if (search[REGEX_DATA]) {
                captureNames = search[REGEX_DATA].captureNames;
            }
            // Only needed if `search` is nonglobal
            origLastIndex = search.lastIndex;
        } else {
            search += ''; // Type-convert
        }

        // Don't use `typeof`; some older browsers return 'function' for regex objects
        if (isType(replacement, 'Function')) {
            // Stringifying `this` fixes a bug in IE < 9 where the last argument in replacement
            // functions isn't type-converted to a string
            result = nativ.replace.call(String(this), search, function() {
                var args = arguments, i;
                if (captureNames) {
                    // Change the `arguments[0]` string primitive to a `String` object that can
                    // store properties. This really does need to use `String` as a constructor
                    args[0] = new String(args[0]);
                    // Store named backreferences on the first argument
                    for (i = 0; i < captureNames.length; ++i) {
                        if (captureNames[i]) {
                            args[0][captureNames[i]] = args[i + 1];
                        }
                    }
                }
                // Update `lastIndex` before calling `replacement`. Fixes IE, Chrome, Firefox,
                // Safari bug (last tested IE 9, Chrome 17, Firefox 11, Safari 5.1)
                if (isRegex && search.global) {
                    search.lastIndex = args[args.length - 2] + args[0].length;
                }
                // Should pass `undefined` as context; see
                // <https://bugs.ecmascript.org/show_bug.cgi?id=154>
                return replacement.apply(undefined, args);
            });
        } else {
            // Ensure that the last value of `args` will be a string when given nonstring `this`,
            // while still throwing on `null` or `undefined` context
            result = nativ.replace.call(this == null ? this : String(this), search, function() {
                // Keep this function's `arguments` available through closure
                var args = arguments;
                return nativ.replace.call(String(replacement), replacementToken, function($0, $1, $2) {
                    var n;
                    // Named or numbered backreference with curly braces
                    if ($1) {
                        /* XRegExp behavior for `${n}`:
                         * 1. Backreference to numbered capture, if `n` is an integer. Use `0` for
                         *    for the entire match. Any number of leading zeros may be used.
                         * 2. Backreference to named capture `n`, if it exists and is not an
                         *    integer overridden by numbered capture. In practice, this does not
                         *    overlap with numbered capture since XRegExp does not allow named
                         *    capture to use a bare integer as the name.
                         * 3. If the name or number does not refer to an existing capturing group,
                         *    it's an error.
                         */
                        n = +$1; // Type-convert; drop leading zeros
                        if (n <= args.length - 3) {
                            return args[n] || '';
                        }
                        // Groups with the same name is an error, else would need `lastIndexOf`
                        n = captureNames ? indexOf(captureNames, $1) : -1;
                        if (n < 0) {
                            throw new SyntaxError('Backreference to undefined group ' + $0);
                        }
                        return args[n + 1] || '';
                    }
                    // Else, special variable or numbered backreference without curly braces
                    if ($2 === '$') { // $$
                        return '$';
                    }
                    if ($2 === '&' || +$2 === 0) { // $&, $0 (not followed by 1-9), $00
                        return args[0];
                    }
                    if ($2 === '`') { // $` (left context)
                        return args[args.length - 1].slice(0, args[args.length - 2]);
                    }
                    if ($2 === "'") { // $' (right context)
                        return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
                    }
                    // Else, numbered backreference without curly braces
                    $2 = +$2; // Type-convert; drop leading zero
                    /* XRegExp behavior for `$n` and `$nn`:
                     * - Backrefs end after 1 or 2 digits. Use `${..}` for more digits.
                     * - `$1` is an error if no capturing groups.
                     * - `$10` is an error if less than 10 capturing groups. Use `${1}0` instead.
                     * - `$01` is `$1` if at least one capturing group, else it's an error.
                     * - `$0` (not followed by 1-9) and `$00` are the entire match.
                     * Native behavior, for comparison:
                     * - Backrefs end after 1 or 2 digits. Cannot reference capturing group 100+.
                     * - `$1` is a literal `$1` if no capturing groups.
                     * - `$10` is `$1` followed by a literal `0` if less than 10 capturing groups.
                     * - `$01` is `$1` if at least one capturing group, else it's a literal `$01`.
                     * - `$0` is a literal `$0`.
                     */
                    if (!isNaN($2)) {
                        if ($2 > args.length - 3) {
                            throw new SyntaxError('Backreference to undefined group ' + $0);
                        }
                        return args[$2] || '';
                    }
                    throw new SyntaxError('Invalid token ' + $0);
                });
            });
        }

        if (isRegex) {
            if (search.global) {
                // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
                search.lastIndex = 0;
            } else {
                // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
                search.lastIndex = origLastIndex;
            }
        }

        return result;
    };

/**
 * Fixes browser bugs in the native `String.prototype.split`. Calling `XRegExp.install('natives')`
 * uses this to override the native method. Use via `XRegExp.split` without overriding natives.
 * @private
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 */
    fixed.split = function(separator, limit) {
        if (!self.isRegExp(separator)) {
            // Browsers handle nonregex split correctly, so use the faster native method
            return nativ.split.apply(this, arguments);
        }

        var str = String(this),
            output = [],
            origLastIndex = separator.lastIndex,
            lastLastIndex = 0,
            lastLength;

        /* Values for `limit`, per the spec:
         * If undefined: pow(2,32) - 1
         * If 0, Infinity, or NaN: 0
         * If positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32);
         * If negative number: pow(2,32) - floor(abs(limit))
         * If other: Type-convert, then use the above rules
         */
        // This line fails in very strange ways for some values of `limit` in Opera 10.5-10.63,
        // unless Opera Dragonfly is open (go figure). It works in at least Opera 9.5-10.1 and 11+
        limit = (limit === undefined ? -1 : limit) >>> 0;

        self.forEach(str, separator, function(match) {
            // This condition is not the same as `if (match[0].length)`
            if ((match.index + match[0].length) > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));
                if (match.length > 1 && match.index < str.length) {
                    Array.prototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = match.index + lastLength;
            }
        });

        if (lastLastIndex === str.length) {
            if (!nativ.test.call(separator, '') || lastLength) {
                output.push('');
            }
        } else {
            output.push(str.slice(lastLastIndex));
        }

        separator.lastIndex = origLastIndex;
        return output.length > limit ? output.slice(0, limit) : output;
    };

/* ==============================
 * Built-in syntax/flag tokens
 * ============================== */

    add = self.addToken;

/* Letter identity escapes that natively match literal characters: `\a`, `\A`, etc. These should be
 * SyntaxErrors but are allowed in web reality. XRegExp makes them errors for cross-browser
 * consistency and to reserve their syntax, but lets them be superseded by addons.
 */
    add(
        /\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/,
        function(match, scope) {
            // \B is allowed in default scope only
            if (match[1] === 'B' && scope === defaultScope) {
                return match[0];
            }
            throw new SyntaxError('Invalid escape ' + match[0]);
        },
        {scope: 'all'}
    );

/* Empty character class: `[]` or `[^]`. This fixes a critical cross-browser syntax inconsistency.
 * Unless this is standardized (per the ES spec), regex syntax can't be accurately parsed because
 * character class endings can't be determined.
 */
    add(
        /\[(\^?)]/,
        function(match) {
            // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
            // (?!) should work like \b\B, but is unreliable in some versions of Firefox
            return match[1] ? '[\\s\\S]' : '\\b\\B';
        }
    );

/* Comment pattern: `(?# )`. Inline comments are an alternative to the line comments allowed in
 * free-spacing mode (flag x).
 */
    add(
        /\(\?#[^)]*\)/,
        function(match, scope, flags) {
            // Keep tokens separated unless the following token is a quantifier
            return isQuantifierNext(match.input, match.index + match[0].length, flags) ?
                '' : '(?:)';
        }
    );

/* Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
 */
    add(
        /\s+|#.*/,
        function(match, scope, flags) {
            // Keep tokens separated unless the following token is a quantifier
            return isQuantifierNext(match.input, match.index + match[0].length, flags) ?
                '' : '(?:)';
        },
        {flag: 'x'}
    );

/* Dot, in dotall mode (aka singleline mode, flag s) only.
 */
    add(
        /\./,
        function() {
            return '[\\s\\S]';
        },
        {flag: 's'}
    );

/* Named backreference: `\k<name>`. Backreference names can use the characters A-Z, a-z, 0-9, _,
 * and $ only.
 */
    add(
        /\\k<([\w$]+)>/,
        function(match) {
            // Groups with the same name is an error, else would need `lastIndexOf`
            var index = isNaN(match[1]) ? (indexOf(this.captureNames, match[1]) + 1) : +match[1],
                endIndex = match.index + match[0].length;
            if (!index || index > this.captureNames.length) {
                throw new SyntaxError('Backreference to undefined group ' + match[0]);
            }
            // Keep backreferences separate from subsequent literal numbers
            return '\\' + index + (
                endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ?
                    '' : '(?:)'
            );
        }
    );

/* Numbered backreference or octal, plus any following digits: `\0`, `\11`, etc. Octals except `\0`
 * not followed by 0-9 and backreferences to unopened capture groups throw an error. Other matches
 * are returned unaltered. IE < 9 doesn't support backreferences above `\99` in regex syntax.
 */
    add(
        /\\(\d+)/,
        function(match, scope) {
            if (
                !(
                    scope === defaultScope &&
                    /^[1-9]/.test(match[1]) &&
                    +match[1] <= this.captureNames.length
                ) &&
                match[1] !== '0'
            ) {
                throw new SyntaxError('Cannot use octal escape or backreference to undefined group ' +
                    match[0]);
            }
            return match[0];
        },
        {scope: 'all'}
    );

/* Named capturing group; match the opening delimiter only: `(?<name>`. Capture names can use the
 * characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers. Supports Python-style
 * `(?P<name>` as an alternate syntax to avoid issues in recent Opera (which natively supports the
 * Python-style syntax). Otherwise, XRegExp might treat numbered backreferences to Python-style
 * named capture as octals.
 */
    add(
        /\(\?P?<([\w$]+)>/,
        function(match) {
            // Disallow bare integers as names because named backreferences are added to match
            // arrays and therefore numeric properties may lead to incorrect lookups
            if (!isNaN(match[1])) {
                throw new SyntaxError('Cannot use integer as capture name ' + match[0]);
            }
            if (match[1] === 'length' || match[1] === '__proto__') {
                throw new SyntaxError('Cannot use reserved word as capture name ' + match[0]);
            }
            /* Allow use of multiple capture groups with same name.
             * This functionality is actually handy sometimes.
             *   - Brian White
              if (indexOf(this.captureNames, match[1]) > -1) {
                  throw new SyntaxError('Cannot use same name for multiple groups ' + match[0]);
              }
             */
            this.captureNames.push(match[1]);
            this.hasNamedCapture = true;
            return '(';
        }
    );

/* Capturing group; match the opening parenthesis only. Required for support of named capturing
 * groups. Also adds explicit capture mode (flag n).
 */
    add(
        /\((?!\?)/,
        function(match, scope, flags) {
            if (flags.indexOf('n') > -1) {
                return '(?:';
            }
            this.captureNames.push(null);
            return '(';
        },
        {optionalFlags: 'n'}
    );

/* ==============================
 * Expose XRegExp
 * ============================== */

    return self;

}());

/*!
 * XRegExp.build 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2012 MIT License
 * Inspired by Lea Verou's RegExp.create <http://lea.verou.me/>
 */

(function(XRegExp) {
    'use strict';

    var REGEX_DATA = 'xregexp',
        subParts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
        parts = XRegExp.union([/\({{([\w$]+)}}\)|{{([\w$]+)}}/, subParts], 'g');

/**
 * Strips a leading `^` and trailing unescaped `$`, if both are present.
 * @private
 * @param {String} pattern Pattern to process.
 * @returns {String} Pattern with edge anchors removed.
 */
    function deanchor(pattern) {
        var leadingAnchor = /^\^/,
            trailingAnchor = /\$$/;

        // Ensure that the trailing `$` isn't escaped
        if (leadingAnchor.test(pattern) && trailingAnchor.test(pattern.replace(/\\[\s\S]/g, ''))) {
            return pattern.replace(leadingAnchor, '').replace(trailingAnchor, '');
        }

        return pattern;
    }

/**
 * Converts the provided value to an XRegExp. Native RegExp flags are not preserved.
 * @private
 * @param {String|RegExp} value Value to convert.
 * @returns {RegExp} XRegExp object with XRegExp syntax applied.
 */
    function asXRegExp(value) {
        return XRegExp.isRegExp(value) ?
            (value[REGEX_DATA] && value[REGEX_DATA].captureNames ?
                // Don't recompile, to preserve capture names
                value :
                // Recompile as XRegExp
                XRegExp(value.source)
            ) :
            // Compile string as XRegExp
            XRegExp(value);
    }

/**
 * Builds regexes using named subpatterns, for readability and pattern reuse. Backreferences in the
 * outer pattern and provided subpatterns are automatically renumbered to work correctly. Native
 * flags used by provided subpatterns are ignored in favor of the `flags` argument.
 * @memberOf XRegExp
 * @param {String} pattern XRegExp pattern using `{{name}}` for embedded subpatterns. Allows
 *   `({{name}})` as shorthand for `(?<name>{{name}})`. Patterns cannot be embedded within
 *   character classes.
 * @param {Object} subs Lookup object for named subpatterns. Values can be strings or regexes. A
 *   leading `^` and trailing unescaped `$` are stripped from subpatterns, if both are present.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Regex with interpolated subpatterns.
 * @example
 *
 * var time = XRegExp.build('(?x)^ {{hours}} ({{minutes}}) $', {
 *   hours: XRegExp.build('{{h12}} : | {{h24}}', {
 *     h12: /1[0-2]|0?[1-9]/,
 *     h24: /2[0-3]|[01][0-9]/
 *   }, 'x'),
 *   minutes: /^[0-5][0-9]$/
 * });
 * time.test('10:59'); // -> true
 * XRegExp.exec('10:59', time).minutes; // -> '59'
 */
    XRegExp.build = function(pattern, subs, flags) {
        var inlineFlags = /^\(\?([\w$]+)\)/.exec(pattern),
            data = {},
            numCaps = 0, // 'Caps' is short for captures
            numPriorCaps,
            numOuterCaps = 0,
            outerCapsMap = [0],
            outerCapNames,
            sub,
            p;

        // Add flags within a leading mode modifier to the overall pattern's flags
        if (inlineFlags) {
            flags = flags || '';
            inlineFlags[1].replace(/./g, function(flag) {
                // Don't add duplicates
                flags += (flags.indexOf(flag) > -1 ? '' : flag);
            });
        }

        for (p in subs) {
            if (subs.hasOwnProperty(p)) {
                // Passing to XRegExp enables extended syntax and ensures independent validity,
                // lest an unescaped `(`, `)`, `[`, or trailing `\` breaks the `(?:)` wrapper. For
                // subpatterns provided as native regexes, it dies on octals and adds the property
                // used to hold extended regex instance data, for simplicity
                sub = asXRegExp(subs[p]);
                data[p] = {
                    // Deanchoring allows embedding independently useful anchored regexes. If you
                    // really need to keep your anchors, double them (i.e., `^^...$$`)
                    pattern: deanchor(sub.source),
                    names: sub[REGEX_DATA].captureNames || []
                };
            }
        }

        // Passing to XRegExp dies on octals and ensures the outer pattern is independently valid;
        // helps keep this simple. Named captures will be put back
        pattern = asXRegExp(pattern);
        outerCapNames = pattern[REGEX_DATA].captureNames || [];
        pattern = pattern.source.replace(parts, function($0, $1, $2, $3, $4) {
            var subName = $1 || $2, capName, intro;
            // Named subpattern
            if (subName) {
                if (!data.hasOwnProperty(subName)) {
                    throw new ReferenceError('Undefined property ' + $0);
                }
                // Named subpattern was wrapped in a capturing group
                if ($1) {
                    capName = outerCapNames[numOuterCaps];
                    outerCapsMap[++numOuterCaps] = ++numCaps;
                    // If it's a named group, preserve the name. Otherwise, use the subpattern name
                    // as the capture name
                    intro = '(?<' + (capName || subName) + '>';
                } else {
                    intro = '(?:';
                }
                numPriorCaps = numCaps;
                return intro + data[subName].pattern.replace(subParts, function(match, paren, backref) {
                    // Capturing group
                    if (paren) {
                        capName = data[subName].names[numCaps - numPriorCaps];
                        ++numCaps;
                        // If the current capture has a name, preserve the name
                        if (capName) {
                            return '(?<' + capName + '>';
                        }
                    // Backreference
                    } else if (backref) {
                        // Rewrite the backreference
                        return '\\' + (+backref + numPriorCaps);
                    }
                    return match;
                }) + ')';
            }
            // Capturing group
            if ($3) {
                capName = outerCapNames[numOuterCaps];
                outerCapsMap[++numOuterCaps] = ++numCaps;
                // If the current capture has a name, preserve the name
                if (capName) {
                    return '(?<' + capName + '>';
                }
            // Backreference
            } else if ($4) {
                // Rewrite the backreference
                return '\\' + outerCapsMap[+$4];
            }
            return $0;
        });

        return XRegExp(pattern, flags);
    };

}(XRegExp));

/*!
 * XRegExp.matchRecursive 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2009-2012 MIT License
 */

(function(XRegExp) {
    'use strict';

/**
 * Returns a match detail object composed of the provided values.
 * @private
 */
    function row(name, value, start, end) {
        return {
            name: name,
            value: value,
            start: start,
            end: end
        };
    }

/**
 * Returns an array of match strings between outermost left and right delimiters, or an array of
 * objects with detailed match parts and position data. An error is thrown if delimiters are
 * unbalanced within the data.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {String} left Left delimiter as an XRegExp pattern.
 * @param {String} right Right delimiter as an XRegExp pattern.
 * @param {String} [flags] Any native or XRegExp flags, used for the left and right delimiters.
 * @param {Object} [options] Lets you specify `valueNames` and `escapeChar` options.
 * @returns {Array} Array of matches, or an empty array.
 * @example
 *
 * // Basic usage
 * var str = '(t((e))s)t()(ing)';
 * XRegExp.matchRecursive(str, '\\(', '\\)', 'g');
 * // -> ['t((e))s', '', 'ing']
 *
 * // Extended information mode with valueNames
 * str = 'Here is <div> <div>an</div></div> example';
 * XRegExp.matchRecursive(str, '<div\\s*>', '</div>', 'gi', {
 *   valueNames: ['between', 'left', 'match', 'right']
 * });
 * // -> [
 * // {name: 'between', value: 'Here is ',       start: 0,  end: 8},
 * // {name: 'left',    value: '<div>',          start: 8,  end: 13},
 * // {name: 'match',   value: ' <div>an</div>', start: 13, end: 27},
 * // {name: 'right',   value: '</div>',         start: 27, end: 33},
 * // {name: 'between', value: ' example',       start: 33, end: 41}
 * // ]
 *
 * // Omitting unneeded parts with null valueNames, and using escapeChar
 * str = '...{1}\\{{function(x,y){return y+x;}}';
 * XRegExp.matchRecursive(str, '{', '}', 'g', {
 *   valueNames: ['literal', null, 'value', null],
 *   escapeChar: '\\'
 * });
 * // -> [
 * // {name: 'literal', value: '...', start: 0, end: 3},
 * // {name: 'value',   value: '1',   start: 4, end: 5},
 * // {name: 'literal', value: '\\{', start: 6, end: 8},
 * // {name: 'value',   value: 'function(x,y){return y+x;}', start: 9, end: 35}
 * // ]
 *
 * // Sticky mode via flag y
 * str = '<1><<<2>>><3>4<5>';
 * XRegExp.matchRecursive(str, '<', '>', 'gy');
 * // -> ['1', '<<2>>', '3']
 */
    XRegExp.matchRecursive = function(str, left, right, flags, options) {
        flags = flags || '';
        options = options || {};
        var global = flags.indexOf('g') > -1,
            sticky = flags.indexOf('y') > -1,
            // Flag `y` is controlled internally
            basicFlags = flags.replace(/y/g, ''),
            escapeChar = options.escapeChar,
            vN = options.valueNames,
            output = [],
            openTokens = 0,
            delimStart = 0,
            delimEnd = 0,
            lastOuterEnd = 0,
            outerStart,
            innerStart,
            leftMatch,
            rightMatch,
            esc;
        left = XRegExp(left, basicFlags);
        right = XRegExp(right, basicFlags);

        if (escapeChar) {
            if (escapeChar.length > 1) {
                throw new Error('Cannot use more than one escape character');
            }
            escapeChar = XRegExp.escape(escapeChar);
            // Using `XRegExp.union` safely rewrites backreferences in `left` and `right`
            esc = new RegExp(
                '(?:' + escapeChar + '[\\S\\s]|(?:(?!' +
                    XRegExp.union([left, right]).source +
                    ')[^' + escapeChar + '])+)+',
                // Flags `gy` not needed here
                flags.replace(/[^im]+/g, '')
            );
        }

        while (true) {
            // If using an escape character, advance to the delimiter's next starting position,
            // skipping any escaped characters in between
            if (escapeChar) {
                delimEnd += (XRegExp.exec(str, esc, delimEnd, 'sticky') || [''])[0].length;
            }
            leftMatch = XRegExp.exec(str, left, delimEnd);
            rightMatch = XRegExp.exec(str, right, delimEnd);
            // Keep the leftmost match only
            if (leftMatch && rightMatch) {
                if (leftMatch.index <= rightMatch.index) {
                    rightMatch = null;
                } else {
                    leftMatch = null;
                }
            }
            /* Paths (LM: leftMatch, RM: rightMatch, OT: openTokens):
             * LM | RM | OT | Result
             * 1  | 0  | 1  | loop
             * 1  | 0  | 0  | loop
             * 0  | 1  | 1  | loop
             * 0  | 1  | 0  | throw
             * 0  | 0  | 1  | throw
             * 0  | 0  | 0  | break
             * Doesn't include the sticky mode special case. The loop ends after the first
             * completed match if not `global`.
             */
            if (leftMatch || rightMatch) {
                delimStart = (leftMatch || rightMatch).index;
                delimEnd = delimStart + (leftMatch || rightMatch)[0].length;
            } else if (!openTokens) {
                break;
            }
            if (sticky && !openTokens && delimStart > lastOuterEnd) {
                break;
            }
            if (leftMatch) {
                if (!openTokens) {
                    outerStart = delimStart;
                    innerStart = delimEnd;
                }
                ++openTokens;
            } else if (rightMatch && openTokens) {
                if (!--openTokens) {
                    if (vN) {
                        if (vN[0] && outerStart > lastOuterEnd) {
                            output.push(row(vN[0], str.slice(lastOuterEnd, outerStart), lastOuterEnd, outerStart));
                        }
                        if (vN[1]) {
                            output.push(row(vN[1], str.slice(outerStart, innerStart), outerStart, innerStart));
                        }
                        if (vN[2]) {
                            output.push(row(vN[2], str.slice(innerStart, delimStart), innerStart, delimStart));
                        }
                        if (vN[3]) {
                            output.push(row(vN[3], str.slice(delimStart, delimEnd), delimStart, delimEnd));
                        }
                    } else {
                        output.push(str.slice(innerStart, delimStart));
                    }
                    lastOuterEnd = delimEnd;
                    if (!global) {
                        break;
                    }
                }
            } else {
                throw new Error('Unbalanced delimiter found in string');
            }
            // If the delimiter matched an empty string, avoid an infinite loop
            if (delimStart === delimEnd) {
                ++delimEnd;
            }
        }

        if (global && !sticky && vN && vN[0] && str.length > lastOuterEnd) {
            output.push(row(vN[0], str.slice(lastOuterEnd), lastOuterEnd, str.length));
        }

        return output;
    };

}(XRegExp));

/*!
 * XRegExp Unicode Base 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2008-2012 MIT License
 * Uses Unicode 6.2.0 <http://unicode.org/>
 * Unicode data generated by Mathias Bynens <http://mathiasbynens.be/>
 */

/**
 * Adds support for the `\p{L}` or `\p{Letter}` Unicode category. Addon packages for other Unicode
 * categories, scripts, blocks, and properties are available separately. Also adds flag A (astral),
 * which enables 21-bit Unicode support. All Unicode tokens can be inverted using `\P{..}` or
 * `\p{^..}`. Token names ignore case, spaces, hyphens, and underscores.
 * @requires XRegExp
 */
(function(XRegExp) {
    'use strict';

// Storage for Unicode data
    var unicode = {};

/* ==============================
 * Private functions
 * ============================== */

// Generates a token lookup name: lowercase, with hyphens, spaces, and underscores removed
    function normalize(name) {
        return name.replace(/[- _]+/g, '').toLowerCase();
    }

// Adds leading zeros if shorter than four characters
    function pad4(str) {
        while (str.length < 4) {
            str = '0' + str;
        }
        return str;
    }

// Converts a hexadecimal number to decimal
    function dec(hex) {
        return parseInt(hex, 16);
    }

// Converts a decimal number to hexadecimal
    function hex(dec) {
        return parseInt(dec, 10).toString(16);
    }

// Gets the decimal code of a literal code unit, \xHH, \uHHHH, or a backslash-escaped literal
    function charCode(chr) {
        var esc = /^\\[xu](.+)/.exec(chr);
        return esc ?
            dec(esc[1]) :
            chr.charCodeAt(chr.charAt(0) === '\\' ? 1 : 0);
    }

// Inverts a list of ordered BMP characters and ranges
    function invertBmp(range) {
        var output = '',
            lastEnd = -1,
            start;
        XRegExp.forEach(range, /(\\x..|\\u....|\\?[\s\S])(?:-(\\x..|\\u....|\\?[\s\S]))?/, function(m) {
            start = charCode(m[1]);
            if (start > (lastEnd + 1)) {
                output += '\\u' + pad4(hex(lastEnd + 1));
                if (start > (lastEnd + 2)) {
                    output += '-\\u' + pad4(hex(start - 1));
                }
            }
            lastEnd = charCode(m[2] || m[1]);
        });
        if (lastEnd < 0xFFFF) {
            output += '\\u' + pad4(hex(lastEnd + 1));
            if (lastEnd < 0xFFFE) {
                output += '-\\uFFFF';
            }
        }
        return output;
    }

// Generates an inverted BMP range on first use
    function cacheInvertedBmp(slug) {
        var prop = 'b!';
        return unicode[slug][prop] || (
            unicode[slug][prop] = invertBmp(unicode[slug].bmp)
        );
    }

// Combines and optionally negates BMP and astral data
    function buildAstral(slug, isNegated) {
        var item = unicode[slug],
            combined = '';
        if (item.bmp && !item.isBmpLast) {
            combined = '[' + item.bmp + ']' + (item.astral ? '|' : '');
        }
        if (item.astral) {
            combined += item.astral;
        }
        if (item.isBmpLast && item.bmp) {
            combined += (item.astral ? '|' : '') + '[' + item.bmp + ']';
        }
        // Astral Unicode tokens always match a code point, never a code unit
        return isNegated ?
            '(?:(?!' + combined + ')(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\0-\uFFFF]))' :
            '(?:' + combined + ')';
    }

// Builds a complete astral pattern on first use
    function cacheAstral(slug, isNegated) {
        var prop = isNegated ? 'a!' : 'a=';
        return unicode[slug][prop] || (
            unicode[slug][prop] = buildAstral(slug, isNegated)
        );
    }

/* ==============================
 * Core functionality
 * ============================== */

/* Add Unicode token syntax: \p{..}, \P{..}, \p{^..}. Also add astral mode (flag A).
 */
    XRegExp.addToken(
        // Use `*` instead of `+` to avoid capturing `^` as the token name in `\p{^}`
        /\\([pP])(?:{(\^?)([^}]*)}|([A-Za-z]))/,
        function(match, scope, flags) {
            var ERR_DOUBLE_NEG = 'Invalid double negation ',
                ERR_UNKNOWN_NAME = 'Unknown Unicode token ',
                ERR_UNKNOWN_REF = 'Unicode token missing data ',
                ERR_ASTRAL_ONLY = 'Astral mode required for Unicode token ',
                ERR_ASTRAL_IN_CLASS = 'Astral mode does not support Unicode tokens within character classes',
                // Negated via \P{..} or \p{^..}
                isNegated = match[1] === 'P' || !!match[2],
                // Switch from BMP (U+FFFF) to astral (U+10FFFF) mode via flag A or implicit opt-in
                isAstralMode = flags.indexOf('A') > -1 || XRegExp.isInstalled('astral'),
                // Token lookup name. Check `[4]` first to avoid passing `undefined` via `\p{}`
                slug = normalize(match[4] || match[3]),
                // Token data object
                item = unicode[slug];

            if (match[1] === 'P' && match[2]) {
                throw new SyntaxError(ERR_DOUBLE_NEG + match[0]);
            }
            if (!unicode.hasOwnProperty(slug)) {
                throw new SyntaxError(ERR_UNKNOWN_NAME + match[0]);
            }

            // Switch to the negated form of the referenced Unicode token
            if (item.inverseOf) {
                slug = normalize(item.inverseOf);
                if (!unicode.hasOwnProperty(slug)) {
                    throw new ReferenceError(ERR_UNKNOWN_REF + match[0] + ' -> ' + item.inverseOf);
                }
                item = unicode[slug];
                isNegated = !isNegated;
            }

            if (!(item.bmp || isAstralMode)) {
                throw new SyntaxError(ERR_ASTRAL_ONLY + match[0]);
            }
            if (isAstralMode) {
                if (scope === 'class') {
                    throw new SyntaxError(ERR_ASTRAL_IN_CLASS);
                }

                return cacheAstral(slug, isNegated);
            }

            return scope === 'class' ?
                (isNegated ? cacheInvertedBmp(slug) : item.bmp) :
                (isNegated ? '[^' : '[') + item.bmp + ']';
        },
        {
            scope: 'all',
            optionalFlags: 'A'
        }
    );

/**
 * Adds to the list of Unicode tokens that XRegExp regexes can match via `\p` or `\P`.
 * @memberOf XRegExp
 * @param {Array} data Objects with named character ranges. Each object may have properties `name`,
 *   `alias`, `isBmpLast`, `inverseOf`, `bmp`, and `astral`. All but `name` are optional, although
 *   one of `bmp` or `astral` is required (unless `inverseOf` is set). If `astral` is absent, the
 *   `bmp` data is used for BMP and astral modes. If `bmp` is absent, the name errors in BMP mode
 *   but works in astral mode. If both `bmp` and `astral` are provided, the `bmp` data only is used
 *   in BMP mode, and the combination of `bmp` and `astral` data is used in astral mode.
 *   `isBmpLast` is needed when a token matches orphan high surrogates *and* uses surrogate pairs
 *   to match astral code points. The `bmp` and `astral` data should be a combination of literal
 *   characters and `\xHH` or `\uHHHH` escape sequences, with hyphens to create ranges. Any regex
 *   metacharacters in the data should be escaped, apart from range-creating hyphens. The `astral`
 *   data can additionally use character classes and alternation, and should use surrogate pairs to
 *   represent astral code points. `inverseOf` can be used to avoid duplicating character data if a
 *   Unicode token is defined as the exact inverse of another token.
 * @example
 *
 * // Basic use
 * XRegExp.addUnicodeData([{
 *   name: 'XDigit',
 *   alias: 'Hexadecimal',
 *   bmp: '0-9A-Fa-f'
 * }]);
 * XRegExp('\\p{XDigit}:\\p{Hexadecimal}+').test('0:3D'); // -> true
 */
    XRegExp.addUnicodeData = function(data) {
        var ERR_NO_NAME = 'Unicode token requires name',
            ERR_NO_DATA = 'Unicode token has no character data ',
            item,
            i;

        for (i = 0; i < data.length; ++i) {
            item = data[i];
            if (!item.name) {
                throw new Error(ERR_NO_NAME);
            }
            if (!(item.inverseOf || item.bmp || item.astral)) {
                throw new Error(ERR_NO_DATA + item.name);
            }
            unicode[normalize(item.name)] = item;
            if (item.alias) {
                unicode[normalize(item.alias)] = item;
            }
        }

        // Reset the pattern cache used by the `XRegExp` constructor, since the same pattern and
        // flags might now produce different results
        XRegExp.cache.flush('patterns');
    };

/* Add data for the Unicode `L` or `Letter` category. Separate addons are available that add other
 * categories, scripts, blocks, and properties.
 */
    XRegExp.addUnicodeData([{
        name: 'L',
        alias: 'Letter',
        bmp: 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
        astral: '\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72]|\uD801[\uDC00-\uDC9D]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1E\uDF30-\uDF40\uDF42-\uDF49\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD81A[\uDC00-\uDE38]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD83-\uDDB2\uDDC1-\uDDC4]|\uD86E[\uDC00-\uDC1D]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD803[\uDC00-\uDC48]|\uD80D[\uDC00-\uDC2E]|\uD805[\uDE80-\uDEAA]|\uD87E[\uDC00-\uDE1D]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD82C[\uDC00\uDC01]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD808[\uDC00-\uDF6E]'
    }]);

}(XRegExp));

/*!
 * XRegExp Unicode Blocks 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2010-2012 MIT License
 * Uses Unicode 6.2.0 <http://unicode.org/>
 * Unicode data generated by Mathias Bynens <http://mathiasbynens.be/>
 */

/**
 * Adds support for all Unicode blocks. Block names use the prefix 'In'. E.g., `\p{InBasicLatin}`.
 * Token names are case insensitive, and any spaces, hyphens, and underscores are ignored.
 * @requires XRegExp, Unicode Base
 */
(function(XRegExp) {
    'use strict';

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Blocks');
    }

    XRegExp.addUnicodeData([
        {
            name: 'InAegean_Numbers',
            astral: '\uD800[\uDD00-\uDD3F]'
        },
        {
            name: 'InAlchemical_Symbols',
            astral: '\uD83D[\uDF00-\uDF7F]'
        },
        {
            name: 'InAlphabetic_Presentation_Forms',
            bmp: '\uFB00-\uFB4F'
        },
        {
            name: 'InAncient_Greek_Musical_Notation',
            astral: '\uD834[\uDE00-\uDE4F]'
        },
        {
            name: 'InAncient_Greek_Numbers',
            astral: '\uD800[\uDD40-\uDD8F]'
        },
        {
            name: 'InAncient_Symbols',
            astral: '\uD800[\uDD90-\uDDCF]'
        },
        {
            name: 'InArabic',
            bmp: '\u0600-\u06FF'
        },
        {
            name: 'InArabic_Extended_A',
            bmp: '\u08A0-\u08FF'
        },
        {
            name: 'InArabic_Mathematical_Alphabetic_Symbols',
            astral: '\uD83B[\uDE00-\uDEFF]'
        },
        {
            name: 'InArabic_Presentation_Forms_A',
            bmp: '\uFB50-\uFDFF'
        },
        {
            name: 'InArabic_Presentation_Forms_B',
            bmp: '\uFE70-\uFEFF'
        },
        {
            name: 'InArabic_Supplement',
            bmp: '\u0750-\u077F'
        },
        {
            name: 'InArmenian',
            bmp: '\u0530-\u058F'
        },
        {
            name: 'InArrows',
            bmp: '\u2190-\u21FF'
        },
        {
            name: 'InAvestan',
            astral: '\uD802[\uDF00-\uDF3F]'
        },
        {
            name: 'InBalinese',
            bmp: '\u1B00-\u1B7F'
        },
        {
            name: 'InBamum',
            bmp: '\uA6A0-\uA6FF'
        },
        {
            name: 'InBamum_Supplement',
            astral: '\uD81A[\uDC00-\uDE3F]'
        },
        {
            name: 'InBasic_Latin',
            bmp: '\0-\x7F'
        },
        {
            name: 'InBatak',
            bmp: '\u1BC0-\u1BFF'
        },
        {
            name: 'InBengali',
            bmp: '\u0980-\u09FF'
        },
        {
            name: 'InBlock_Elements',
            bmp: '\u2580-\u259F'
        },
        {
            name: 'InBopomofo',
            bmp: '\u3100-\u312F'
        },
        {
            name: 'InBopomofo_Extended',
            bmp: '\u31A0-\u31BF'
        },
        {
            name: 'InBox_Drawing',
            bmp: '\u2500-\u257F'
        },
        {
            name: 'InBrahmi',
            astral: '\uD804[\uDC00-\uDC7F]'
        },
        {
            name: 'InBraille_Patterns',
            bmp: '\u2800-\u28FF'
        },
        {
            name: 'InBuginese',
            bmp: '\u1A00-\u1A1F'
        },
        {
            name: 'InBuhid',
            bmp: '\u1740-\u175F'
        },
        {
            name: 'InByzantine_Musical_Symbols',
            astral: '\uD834[\uDC00-\uDCFF]'
        },
        {
            name: 'InCJK_Compatibility',
            bmp: '\u3300-\u33FF'
        },
        {
            name: 'InCJK_Compatibility_Forms',
            bmp: '\uFE30-\uFE4F'
        },
        {
            name: 'InCJK_Compatibility_Ideographs',
            bmp: '\uF900-\uFAFF'
        },
        {
            name: 'InCJK_Compatibility_Ideographs_Supplement',
            astral: '\uD87E[\uDC00-\uDE1F]'
        },
        {
            name: 'InCJK_Radicals_Supplement',
            bmp: '\u2E80-\u2EFF'
        },
        {
            name: 'InCJK_Strokes',
            bmp: '\u31C0-\u31EF'
        },
        {
            name: 'InCJK_Symbols_and_Punctuation',
            bmp: '\u3000-\u303F'
        },
        {
            name: 'InCJK_Unified_Ideographs',
            bmp: '\u4E00-\u9FFF'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_A',
            bmp: '\u3400-\u4DBF'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_B',
            astral: '[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF]'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_C',
            astral: '\uD86D[\uDC00-\uDF3F]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD869[\uDF00-\uDFFF]'
        },
        {
            name: 'InCJK_Unified_Ideographs_Extension_D',
            astral: '\uD86D[\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1F]'
        },
        {
            name: 'InCarian',
            astral: '\uD800[\uDEA0-\uDEDF]'
        },
        {
            name: 'InChakma',
            astral: '\uD804[\uDD00-\uDD4F]'
        },
        {
            name: 'InCham',
            bmp: '\uAA00-\uAA5F'
        },
        {
            name: 'InCherokee',
            bmp: '\u13A0-\u13FF'
        },
        {
            name: 'InCombining_Diacritical_Marks',
            bmp: '\u0300-\u036F'
        },
        {
            name: 'InCombining_Diacritical_Marks_Supplement',
            bmp: '\u1DC0-\u1DFF'
        },
        {
            name: 'InCombining_Diacritical_Marks_for_Symbols',
            bmp: '\u20D0-\u20FF'
        },
        {
            name: 'InCombining_Half_Marks',
            bmp: '\uFE20-\uFE2F'
        },
        {
            name: 'InCommon_Indic_Number_Forms',
            bmp: '\uA830-\uA83F'
        },
        {
            name: 'InControl_Pictures',
            bmp: '\u2400-\u243F'
        },
        {
            name: 'InCoptic',
            bmp: '\u2C80-\u2CFF'
        },
        {
            name: 'InCounting_Rod_Numerals',
            astral: '\uD834[\uDF60-\uDF7F]'
        },
        {
            name: 'InCuneiform',
            astral: '\uD808[\uDC00-\uDFFF]'
        },
        {
            name: 'InCuneiform_Numbers_and_Punctuation',
            astral: '\uD809[\uDC00-\uDC7F]'
        },
        {
            name: 'InCurrency_Symbols',
            bmp: '\u20A0-\u20CF'
        },
        {
            name: 'InCypriot_Syllabary',
            astral: '\uD802[\uDC00-\uDC3F]'
        },
        {
            name: 'InCyrillic',
            bmp: '\u0400-\u04FF'
        },
        {
            name: 'InCyrillic_Extended_A',
            bmp: '\u2DE0-\u2DFF'
        },
        {
            name: 'InCyrillic_Extended_B',
            bmp: '\uA640-\uA69F'
        },
        {
            name: 'InCyrillic_Supplement',
            bmp: '\u0500-\u052F'
        },
        {
            name: 'InDeseret',
            astral: '\uD801[\uDC00-\uDC4F]'
        },
        {
            name: 'InDevanagari',
            bmp: '\u0900-\u097F'
        },
        {
            name: 'InDevanagari_Extended',
            bmp: '\uA8E0-\uA8FF'
        },
        {
            name: 'InDingbats',
            bmp: '\u2700-\u27BF'
        },
        {
            name: 'InDomino_Tiles',
            astral: '\uD83C[\uDC30-\uDC9F]'
        },
        {
            name: 'InEgyptian_Hieroglyphs',
            astral: '\uD80C[\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F]'
        },
        {
            name: 'InEmoticons',
            astral: '\uD83D[\uDE00-\uDE4F]'
        },
        {
            name: 'InEnclosed_Alphanumeric_Supplement',
            astral: '\uD83C[\uDD00-\uDDFF]'
        },
        {
            name: 'InEnclosed_Alphanumerics',
            bmp: '\u2460-\u24FF'
        },
        {
            name: 'InEnclosed_CJK_Letters_and_Months',
            bmp: '\u3200-\u32FF'
        },
        {
            name: 'InEnclosed_Ideographic_Supplement',
            astral: '\uD83C[\uDE00-\uDEFF]'
        },
        {
            name: 'InEthiopic',
            bmp: '\u1200-\u137F'
        },
        {
            name: 'InEthiopic_Extended',
            bmp: '\u2D80-\u2DDF'
        },
        {
            name: 'InEthiopic_Extended_A',
            bmp: '\uAB00-\uAB2F'
        },
        {
            name: 'InEthiopic_Supplement',
            bmp: '\u1380-\u139F'
        },
        {
            name: 'InGeneral_Punctuation',
            bmp: '\u2000-\u206F'
        },
        {
            name: 'InGeometric_Shapes',
            bmp: '\u25A0-\u25FF'
        },
        {
            name: 'InGeorgian',
            bmp: '\u10A0-\u10FF'
        },
        {
            name: 'InGeorgian_Supplement',
            bmp: '\u2D00-\u2D2F'
        },
        {
            name: 'InGlagolitic',
            bmp: '\u2C00-\u2C5F'
        },
        {
            name: 'InGothic',
            astral: '\uD800[\uDF30-\uDF4F]'
        },
        {
            name: 'InGreek_Extended',
            bmp: '\u1F00-\u1FFF'
        },
        {
            name: 'InGreek_and_Coptic',
            bmp: '\u0370-\u03FF'
        },
        {
            name: 'InGujarati',
            bmp: '\u0A80-\u0AFF'
        },
        {
            name: 'InGurmukhi',
            bmp: '\u0A00-\u0A7F'
        },
        {
            name: 'InHalfwidth_and_Fullwidth_Forms',
            bmp: '\uFF00-\uFFEF'
        },
        {
            name: 'InHangul_Compatibility_Jamo',
            bmp: '\u3130-\u318F'
        },
        {
            name: 'InHangul_Jamo',
            bmp: '\u1100-\u11FF'
        },
        {
            name: 'InHangul_Jamo_Extended_A',
            bmp: '\uA960-\uA97F'
        },
        {
            name: 'InHangul_Jamo_Extended_B',
            bmp: '\uD7B0-\uD7FF'
        },
        {
            name: 'InHangul_Syllables',
            bmp: '\uAC00-\uD7AF'
        },
        {
            name: 'InHanunoo',
            bmp: '\u1720-\u173F'
        },
        {
            name: 'InHebrew',
            bmp: '\u0590-\u05FF'
        },
        {
            name: 'InHigh_Private_Use_Surrogates',
            bmp: '\uDB80-\uDBFF'
        },
        {
            name: 'InHigh_Surrogates',
            bmp: '\uD800-\uDB7F'
        },
        {
            name: 'InHiragana',
            bmp: '\u3040-\u309F'
        },
        {
            name: 'InIPA_Extensions',
            bmp: '\u0250-\u02AF'
        },
        {
            name: 'InIdeographic_Description_Characters',
            bmp: '\u2FF0-\u2FFF'
        },
        {
            name: 'InImperial_Aramaic',
            astral: '\uD802[\uDC40-\uDC5F]'
        },
        {
            name: 'InInscriptional_Pahlavi',
            astral: '\uD802[\uDF60-\uDF7F]'
        },
        {
            name: 'InInscriptional_Parthian',
            astral: '\uD802[\uDF40-\uDF5F]'
        },
        {
            name: 'InJavanese',
            bmp: '\uA980-\uA9DF'
        },
        {
            name: 'InKaithi',
            astral: '\uD804[\uDC80-\uDCCF]'
        },
        {
            name: 'InKana_Supplement',
            astral: '\uD82C[\uDC00-\uDCFF]'
        },
        {
            name: 'InKanbun',
            bmp: '\u3190-\u319F'
        },
        {
            name: 'InKangxi_Radicals',
            bmp: '\u2F00-\u2FDF'
        },
        {
            name: 'InKannada',
            bmp: '\u0C80-\u0CFF'
        },
        {
            name: 'InKatakana',
            bmp: '\u30A0-\u30FF'
        },
        {
            name: 'InKatakana_Phonetic_Extensions',
            bmp: '\u31F0-\u31FF'
        },
        {
            name: 'InKayah_Li',
            bmp: '\uA900-\uA92F'
        },
        {
            name: 'InKharoshthi',
            astral: '\uD802[\uDE00-\uDE5F]'
        },
        {
            name: 'InKhmer',
            bmp: '\u1780-\u17FF'
        },
        {
            name: 'InKhmer_Symbols',
            bmp: '\u19E0-\u19FF'
        },
        {
            name: 'InLao',
            bmp: '\u0E80-\u0EFF'
        },
        {
            name: 'InLatin_Extended_Additional',
            bmp: '\u1E00-\u1EFF'
        },
        {
            name: 'InLatin_Extended_A',
            bmp: '\u0100-\u017F'
        },
        {
            name: 'InLatin_Extended_B',
            bmp: '\u0180-\u024F'
        },
        {
            name: 'InLatin_Extended_C',
            bmp: '\u2C60-\u2C7F'
        },
        {
            name: 'InLatin_Extended_D',
            bmp: '\uA720-\uA7FF'
        },
        {
            name: 'InLatin_1_Supplement',
            bmp: '\x80-\xFF'
        },
        {
            name: 'InLepcha',
            bmp: '\u1C00-\u1C4F'
        },
        {
            name: 'InLetterlike_Symbols',
            bmp: '\u2100-\u214F'
        },
        {
            name: 'InLimbu',
            bmp: '\u1900-\u194F'
        },
        {
            name: 'InLinear_B_Ideograms',
            astral: '\uD800[\uDC80-\uDCFF]'
        },
        {
            name: 'InLinear_B_Syllabary',
            astral: '\uD800[\uDC00-\uDC7F]'
        },
        {
            name: 'InLisu',
            bmp: '\uA4D0-\uA4FF'
        },
        {
            name: 'InLow_Surrogates',
            bmp: '\uDC00-\uDFFF'
        },
        {
            name: 'InLycian',
            astral: '\uD800[\uDE80-\uDE9F]'
        },
        {
            name: 'InLydian',
            astral: '\uD802[\uDD20-\uDD3F]'
        },
        {
            name: 'InMahjong_Tiles',
            astral: '\uD83C[\uDC00-\uDC2F]'
        },
        {
            name: 'InMalayalam',
            bmp: '\u0D00-\u0D7F'
        },
        {
            name: 'InMandaic',
            bmp: '\u0840-\u085F'
        },
        {
            name: 'InMathematical_Alphanumeric_Symbols',
            astral: '\uD835[\uDC00-\uDFFF]'
        },
        {
            name: 'InMathematical_Operators',
            bmp: '\u2200-\u22FF'
        },
        {
            name: 'InMeetei_Mayek',
            bmp: '\uABC0-\uABFF'
        },
        {
            name: 'InMeetei_Mayek_Extensions',
            bmp: '\uAAE0-\uAAFF'
        },
        {
            name: 'InMeroitic_Cursive',
            astral: '\uD802[\uDDA0-\uDDFF]'
        },
        {
            name: 'InMeroitic_Hieroglyphs',
            astral: '\uD802[\uDD80-\uDD9F]'
        },
        {
            name: 'InMiao',
            astral: '\uD81B[\uDF00-\uDF9F]'
        },
        {
            name: 'InMiscellaneous_Mathematical_Symbols_A',
            bmp: '\u27C0-\u27EF'
        },
        {
            name: 'InMiscellaneous_Mathematical_Symbols_B',
            bmp: '\u2980-\u29FF'
        },
        {
            name: 'InMiscellaneous_Symbols',
            bmp: '\u2600-\u26FF'
        },
        {
            name: 'InMiscellaneous_Symbols_And_Pictographs',
            astral: '\uD83D[\uDC00-\uDDFF]|\uD83C[\uDF00-\uDFFF]'
        },
        {
            name: 'InMiscellaneous_Symbols_and_Arrows',
            bmp: '\u2B00-\u2BFF'
        },
        {
            name: 'InMiscellaneous_Technical',
            bmp: '\u2300-\u23FF'
        },
        {
            name: 'InModifier_Tone_Letters',
            bmp: '\uA700-\uA71F'
        },
        {
            name: 'InMongolian',
            bmp: '\u1800-\u18AF'
        },
        {
            name: 'InMusical_Symbols',
            astral: '\uD834[\uDD00-\uDDFF]'
        },
        {
            name: 'InMyanmar',
            bmp: '\u1000-\u109F'
        },
        {
            name: 'InMyanmar_Extended_A',
            bmp: '\uAA60-\uAA7F'
        },
        {
            name: 'InNKo',
            bmp: '\u07C0-\u07FF'
        },
        {
            name: 'InNew_Tai_Lue',
            bmp: '\u1980-\u19DF'
        },
        {
            name: 'InNumber_Forms',
            bmp: '\u2150-\u218F'
        },
        {
            name: 'InOgham',
            bmp: '\u1680-\u169F'
        },
        {
            name: 'InOl_Chiki',
            bmp: '\u1C50-\u1C7F'
        },
        {
            name: 'InOld_Italic',
            astral: '\uD800[\uDF00-\uDF2F]'
        },
        {
            name: 'InOld_Persian',
            astral: '\uD800[\uDFA0-\uDFDF]'
        },
        {
            name: 'InOld_South_Arabian',
            astral: '\uD802[\uDE60-\uDE7F]'
        },
        {
            name: 'InOld_Turkic',
            astral: '\uD803[\uDC00-\uDC4F]'
        },
        {
            name: 'InOptical_Character_Recognition',
            bmp: '\u2440-\u245F'
        },
        {
            name: 'InOriya',
            bmp: '\u0B00-\u0B7F'
        },
        {
            name: 'InOsmanya',
            astral: '\uD801[\uDC80-\uDCAF]'
        },
        {
            name: 'InPhags_pa',
            bmp: '\uA840-\uA87F'
        },
        {
            name: 'InPhaistos_Disc',
            astral: '\uD800[\uDDD0-\uDDFF]'
        },
        {
            name: 'InPhoenician',
            astral: '\uD802[\uDD00-\uDD1F]'
        },
        {
            name: 'InPhonetic_Extensions',
            bmp: '\u1D00-\u1D7F'
        },
        {
            name: 'InPhonetic_Extensions_Supplement',
            bmp: '\u1D80-\u1DBF'
        },
        {
            name: 'InPlaying_Cards',
            astral: '\uD83C[\uDCA0-\uDCFF]'
        },
        {
            name: 'InPrivate_Use_Area',
            bmp: '\uE000-\uF8FF'
        },
        {
            name: 'InRejang',
            bmp: '\uA930-\uA95F'
        },
        {
            name: 'InRumi_Numeral_Symbols',
            astral: '\uD803[\uDE60-\uDE7F]'
        },
        {
            name: 'InRunic',
            bmp: '\u16A0-\u16FF'
        },
        {
            name: 'InSamaritan',
            bmp: '\u0800-\u083F'
        },
        {
            name: 'InSaurashtra',
            bmp: '\uA880-\uA8DF'
        },
        {
            name: 'InSharada',
            astral: '\uD804[\uDD80-\uDDDF]'
        },
        {
            name: 'InShavian',
            astral: '\uD801[\uDC50-\uDC7F]'
        },
        {
            name: 'InSinhala',
            bmp: '\u0D80-\u0DFF'
        },
        {
            name: 'InSmall_Form_Variants',
            bmp: '\uFE50-\uFE6F'
        },
        {
            name: 'InSora_Sompeng',
            astral: '\uD804[\uDCD0-\uDCFF]'
        },
        {
            name: 'InSpacing_Modifier_Letters',
            bmp: '\u02B0-\u02FF'
        },
        {
            name: 'InSpecials',
            bmp: '\uFFF0-\uFFFF'
        },
        {
            name: 'InSundanese',
            bmp: '\u1B80-\u1BBF'
        },
        {
            name: 'InSundanese_Supplement',
            bmp: '\u1CC0-\u1CCF'
        },
        {
            name: 'InSuperscripts_and_Subscripts',
            bmp: '\u2070-\u209F'
        },
        {
            name: 'InSupplemental_Arrows_A',
            bmp: '\u27F0-\u27FF'
        },
        {
            name: 'InSupplemental_Arrows_B',
            bmp: '\u2900-\u297F'
        },
        {
            name: 'InSupplemental_Mathematical_Operators',
            bmp: '\u2A00-\u2AFF'
        },
        {
            name: 'InSupplemental_Punctuation',
            bmp: '\u2E00-\u2E7F'
        },
        {
            name: 'InSupplementary_Private_Use_Area_A',
            astral: '[\uDB80-\uDBBF][\uDC00-\uDFFF]'
        },
        {
            name: 'InSupplementary_Private_Use_Area_B',
            astral: '[\uDBC0-\uDBFF][\uDC00-\uDFFF]'
        },
        {
            name: 'InSyloti_Nagri',
            bmp: '\uA800-\uA82F'
        },
        {
            name: 'InSyriac',
            bmp: '\u0700-\u074F'
        },
        {
            name: 'InTagalog',
            bmp: '\u1700-\u171F'
        },
        {
            name: 'InTagbanwa',
            bmp: '\u1760-\u177F'
        },
        {
            name: 'InTags',
            astral: '\uDB40[\uDC00-\uDC7F]'
        },
        {
            name: 'InTai_Le',
            bmp: '\u1950-\u197F'
        },
        {
            name: 'InTai_Tham',
            bmp: '\u1A20-\u1AAF'
        },
        {
            name: 'InTai_Viet',
            bmp: '\uAA80-\uAADF'
        },
        {
            name: 'InTai_Xuan_Jing_Symbols',
            astral: '\uD834[\uDF00-\uDF5F]'
        },
        {
            name: 'InTakri',
            astral: '\uD805[\uDE80-\uDECF]'
        },
        {
            name: 'InTamil',
            bmp: '\u0B80-\u0BFF'
        },
        {
            name: 'InTelugu',
            bmp: '\u0C00-\u0C7F'
        },
        {
            name: 'InThaana',
            bmp: '\u0780-\u07BF'
        },
        {
            name: 'InThai',
            bmp: '\u0E00-\u0E7F'
        },
        {
            name: 'InTibetan',
            bmp: '\u0F00-\u0FFF'
        },
        {
            name: 'InTifinagh',
            bmp: '\u2D30-\u2D7F'
        },
        {
            name: 'InTransport_And_Map_Symbols',
            astral: '\uD83D[\uDE80-\uDEFF]'
        },
        {
            name: 'InUgaritic',
            astral: '\uD800[\uDF80-\uDF9F]'
        },
        {
            name: 'InUnified_Canadian_Aboriginal_Syllabics',
            bmp: '\u1400-\u167F'
        },
        {
            name: 'InUnified_Canadian_Aboriginal_Syllabics_Extended',
            bmp: '\u18B0-\u18FF'
        },
        {
            name: 'InVai',
            bmp: '\uA500-\uA63F'
        },
        {
            name: 'InVariation_Selectors',
            bmp: '\uFE00-\uFE0F'
        },
        {
            name: 'InVariation_Selectors_Supplement',
            astral: '\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'InVedic_Extensions',
            bmp: '\u1CD0-\u1CFF'
        },
        {
            name: 'InVertical_Forms',
            bmp: '\uFE10-\uFE1F'
        },
        {
            name: 'InYi_Radicals',
            bmp: '\uA490-\uA4CF'
        },
        {
            name: 'InYi_Syllables',
            bmp: '\uA000-\uA48F'
        },
        {
            name: 'InYijing_Hexagram_Symbols',
            bmp: '\u4DC0-\u4DFF'
        }
    ]);

}(XRegExp));

/*!
 * XRegExp Unicode Categories 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2010-2012 MIT License
 * Uses Unicode 6.2.0 <http://unicode.org/>
 * Unicode data generated by Mathias Bynens <http://mathiasbynens.be/>
 */

/**
 * Adds support for all Unicode categories. E.g., `\p{Lu}` or `\p{Uppercase Letter}`. Token names
 * are case insensitive, and any spaces, hyphens, and underscores are ignored.
 * @requires XRegExp, Unicode Base
 */
(function(XRegExp) {
    'use strict';

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Categories');
    }

    XRegExp.addUnicodeData([
        {
            name: 'C',
            alias: 'Other',
            isBmpLast: true,
            bmp: '\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF',
            astral: '\uD808[\uDF6F-\uDFFF]|\uD809[\uDC63-\uDC6F\uDC74-\uDFFF]|\uD804[\uDC4E-\uDC51\uDC70-\uDC7F\uDCBD\uDCC2-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD44-\uDD7F\uDDC9-\uDDCF\uDDDA-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC60-\uDCFF\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE34-\uDE37\uDE3B-\uDE3E\uDE48-\uDE4F\uDE59-\uDE5F\uDE80-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF80-\uDFFF]|\uD86D[\uDF35-\uDF3F]|\uD81B[\uDC00-\uDEFF\uDF45-\uDF4F\uDF7F-\uDF8E\uDFA0-\uDFFF]|\uD86E[\uDC1E-\uDFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8B-\uDD8F\uDD9C-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEFF\uDF1F\uDF24-\uDF2F\uDF4B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]|\uD803[\uDC49-\uDE5F\uDE7F-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|[\uD806\uD807\uD80A\uD80B\uD80E-\uD819\uD81C-\uD82B\uD82D-\uD833\uD836-\uD83A\uD83E\uD83F\uD86F-\uD87D\uD87F-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD83D[\uDC3F\uDC41\uDCF8\uDCFD-\uDCFF\uDD3E\uDD3F\uDD44-\uDD4F\uDD68-\uDDFA\uDE41-\uDE44\uDE50-\uDE7F\uDEC6-\uDEFF\uDF74-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCBF\uDCC0\uDCD0\uDCE0-\uDCFF\uDD0B-\uDD0F\uDD2F\uDD6C-\uDD6F\uDD9B-\uDDE5\uDE03-\uDE0F\uDE3B-\uDE3F\uDE49-\uDE4F\uDE52-\uDEFF\uDF21-\uDF2F\uDF36\uDF7D-\uDF7F\uDF94-\uDF9F\uDFC5\uDFCB-\uDFDF\uDFF1-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD81A[\uDE39-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDD73-\uDD7A\uDDDE-\uDDFF\uDE46-\uDEFF\uDF57-\uDF5F\uDF72-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDFFF]|\uD805[\uDC00-\uDE7F\uDEB8-\uDEBF\uDECA-\uDFFF]|\uD82C[\uDC02-\uDFFF]'
        },
        {
            name: 'Cc',
            alias: 'Control',
            bmp: '\0-\x1F\x7F-\x9F'
        },
        {
            name: 'Cf',
            alias: 'Format',
            bmp: '\xAD\u0600-\u0604\u06DD\u070F\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\uFFF9-\uFFFB',
            astral: '\uDB40[\uDC01\uDC20-\uDC7F]|\uD834[\uDD73-\uDD7A]|\uD804\uDCBD'
        },
        {
            name: 'Cn',
            alias: 'Unassigned',
            bmp: '\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u05FF\u0605\u061C\u061D\u070E\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u2065-\u2069\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD\uFEFE\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFF8\uFFFE\uFFFF',
            astral: '\uD808[\uDF6F-\uDFFF]|\uDB40[\uDC00\uDC02-\uDC1F\uDC80-\uDCFF\uDDF0-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDDDE-\uDDFF\uDE46-\uDEFF\uDF57-\uDF5F\uDF72-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC60-\uDCFF\uDD1C-\uDD1E\uDD3A-\uDD3E\uDD40-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE34-\uDE37\uDE3B-\uDE3E\uDE48-\uDE4F\uDE59-\uDE5F\uDE80-\uDEFF\uDF36-\uDF38\uDF56\uDF57\uDF73-\uDF77\uDF80-\uDFFF]|\uD86D[\uDF35-\uDF3F]|\uD81B[\uDC00-\uDEFF\uDF45-\uDF4F\uDF7F-\uDF8E\uDFA0-\uDFFF]|\uD809[\uDC63-\uDC6F\uDC74-\uDFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDCFF\uDD03-\uDD06\uDD34-\uDD36\uDD8B-\uDD8F\uDD9C-\uDDCF\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEFF\uDF1F\uDF24-\uDF2F\uDF4B-\uDF7F\uDF9E\uDFC4-\uDFC7\uDFD6-\uDFFF]|\uD869[\uDED7-\uDEFF]|\uD804[\uDC4E-\uDC51\uDC70-\uDC7F\uDCC2-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD44-\uDD7F\uDDC9-\uDDCF\uDDDA-\uDFFF]|\uD83B[\uDC00-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDEEF\uDEF2-\uDFFF]|[\uDBBF\uDBFF][\uDFFE\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD803[\uDC49-\uDE5F\uDE7F-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|[\uD806\uD807\uD80A\uD80B\uD80E-\uD819\uD81C-\uD82B\uD82D-\uD833\uD836-\uD83A\uD83E\uD83F\uD86F-\uD87D\uD87F-\uDB3F\uDB41-\uDB7F][\uDC00-\uDFFF]|\uD83D[\uDC3F\uDC41\uDCF8\uDCFD-\uDCFF\uDD3E\uDD3F\uDD44-\uDD4F\uDD68-\uDDFA\uDE41-\uDE44\uDE50-\uDE7F\uDEC6-\uDEFF\uDF74-\uDFFF]|\uD86E[\uDC1E-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCBF\uDCC0\uDCD0\uDCE0-\uDCFF\uDD0B-\uDD0F\uDD2F\uDD6C-\uDD6F\uDD9B-\uDDE5\uDE03-\uDE0F\uDE3B-\uDE3F\uDE49-\uDE4F\uDE52-\uDEFF\uDF21-\uDF2F\uDF36\uDF7D-\uDF7F\uDF94-\uDF9F\uDFC5\uDFCB-\uDFDF\uDFF1-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]|\uD81A[\uDE39-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDFFF]|\uD805[\uDC00-\uDE7F\uDEB8-\uDEBF\uDECA-\uDFFF]|\uD82C[\uDC02-\uDFFF]'
        },
        {
            name: 'Co',
            alias: 'Private_Use',
            bmp: '\uE000-\uF8FF',
            astral: '[\uDB80-\uDBBE\uDBC0-\uDBFE][\uDC00-\uDFFF]|[\uDBBF\uDBFF][\uDC00-\uDFFD]'
        },
        {
            name: 'Cs',
            alias: 'Surrogate',
            bmp: '\uD800-\uDFFF'
        },
        // Included in Unicode Base
        /*{
            name: 'L',
            alias: 'Letter',
            bmp: '...',
            astral: '...'
        },*/
        {
            name: 'Ll',
            alias: 'Lowercase_Letter',
            bmp: 'a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A',
            astral: '\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD801[\uDC28-\uDC4F]'
        },
        {
            name: 'Lm',
            alias: 'Modifier_Letter',
            bmp: '\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uAA70\uAADD\uAAF3\uAAF4\uFF70\uFF9E\uFF9F',
            astral: '\uD81B[\uDF93-\uDF9F]'
        },
        {
            name: 'Lo',
            alias: 'Other_Letter',
            bmp: '\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
            astral: '\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1E\uDF30-\uDF40\uDF42-\uDF49\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD81A[\uDC00-\uDE38]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD83-\uDDB2\uDDC1-\uDDC4]|\uD86E[\uDC00-\uDC1D]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD803[\uDC00-\uDC48]|\uD80D[\uDC00-\uDC2E]|\uD805[\uDE80-\uDEAA]|\uD87E[\uDC00-\uDE1D]|\uD81B[\uDF00-\uDF44\uDF50]|\uD801[\uDC50-\uDC9D]|\uD82C[\uDC00\uDC01]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD808[\uDC00-\uDF6E]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]'
        },
        {
            name: 'Lt',
            alias: 'Titlecase_Letter',
            bmp: '\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC'
        },
        {
            name: 'Lu',
            alias: 'Uppercase_Letter',
            bmp: 'A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A',
            astral: '\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD801[\uDC00-\uDC27]'
        },
        {
            name: 'M',
            alias: 'Mark',
            bmp: '\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u08FE\u0900-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C01-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D02\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1DC0-\u1DE6\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE26',
            astral: '\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC80-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD80-\uDD82\uDDB3-\uDDC0]|\uD805[\uDEAB-\uDEB7]|\uD800\uDDFD|\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'Mc',
            alias: 'Spacing_Mark',
            bmp: '\u0903\u093B\u093E-\u0940\u0949-\u094C\u094E\u094F\u0982\u0983\u09BE-\u09C0\u09C7\u09C8\u09CB\u09CC\u09D7\u0A03\u0A3E-\u0A40\u0A83\u0ABE-\u0AC0\u0AC9\u0ACB\u0ACC\u0B02\u0B03\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD7\u0C01-\u0C03\u0C41-\u0C44\u0C82\u0C83\u0CBE\u0CC0-\u0CC4\u0CC7\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0D02\u0D03\u0D3E-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D57\u0D82\u0D83\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DF2\u0DF3\u0F3E\u0F3F\u0F7F\u102B\u102C\u1031\u1038\u103B\u103C\u1056\u1057\u1062-\u1064\u1067-\u106D\u1083\u1084\u1087-\u108C\u108F\u109A-\u109C\u17B6\u17BE-\u17C5\u17C7\u17C8\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u19B0-\u19C0\u19C8\u19C9\u1A19-\u1A1B\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1B04\u1B35\u1B3B\u1B3D-\u1B41\u1B43\u1B44\u1B82\u1BA1\u1BA6\u1BA7\u1BAA\u1BAC\u1BAD\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1C24-\u1C2B\u1C34\u1C35\u1CE1\u1CF2\u1CF3\u302E\u302F\uA823\uA824\uA827\uA880\uA881\uA8B4-\uA8C3\uA952\uA953\uA983\uA9B4\uA9B5\uA9BA\uA9BB\uA9BD-\uA9C0\uAA2F\uAA30\uAA33\uAA34\uAA4D\uAA7B\uAAEB\uAAEE\uAAEF\uAAF5\uABE3\uABE4\uABE6\uABE7\uABE9\uABEA\uABEC',
            astral: '\uD834[\uDD65\uDD66\uDD6D-\uDD72]|\uD804[\uDC00\uDC02\uDC82\uDCB0-\uDCB2\uDCB7\uDCB8\uDD2C\uDD82\uDDB3-\uDDB5\uDDBF\uDDC0]|\uD805[\uDEAC\uDEAE\uDEAF\uDEB6]|\uD81B[\uDF51-\uDF7E]'
        },
        {
            name: 'Me',
            alias: 'Enclosing_Mark',
            bmp: '\u0488\u0489\u20DD-\u20E0\u20E2-\u20E4\uA670-\uA672'
        },
        {
            name: 'Mn',
            alias: 'Nonspacing_Mark',
            bmp: '\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u08FE\u0900-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1DC0-\u1DE6\u1DFC-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE26',
            astral: '\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD81B[\uDF8F-\uDF92]|\uD805[\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7]|\uD804[\uDC01\uDC38-\uDC46\uDC80\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD80\uDD81\uDDB6-\uDDBE]|\uD800\uDDFD|\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'N',
            alias: 'Number',
            bmp: '0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19',
            astral: '\uD802[\uDC58-\uDC5F\uDD16-\uDD1B\uDE40-\uDE47\uDE7D\uDE7E\uDF58-\uDF5F\uDF78-\uDF7F]|\uD801[\uDCA0-\uDCA9]|\uD809[\uDC00-\uDC62]|\uD835[\uDFCE-\uDFFF]|\uD800[\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDF20-\uDF23\uDF41\uDF4A\uDFD1-\uDFD5]|\uD834[\uDF60-\uDF71]|\uD803[\uDE60-\uDE7E]|\uD83C[\uDD00-\uDD0A]|\uD805[\uDEC0-\uDEC9]|\uD804[\uDC52-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9]'
        },
        {
            name: 'Nd',
            alias: 'Decimal_Number',
            bmp: '0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19',
            astral: '\uD804[\uDC66-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9]|\uD805[\uDEC0-\uDEC9]|\uD801[\uDCA0-\uDCA9]|\uD835[\uDFCE-\uDFFF]'
        },
        {
            name: 'Nl',
            alias: 'Letter_Number',
            bmp: '\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF',
            astral: '\uD800[\uDD40-\uDD74\uDF41\uDF4A\uDFD1-\uDFD5]|\uD809[\uDC00-\uDC62]'
        },
        {
            name: 'No',
            alias: 'Other_Number',
            bmp: '\xB2\xB3\xB9\xBC-\xBE\u09F4-\u09F9\u0B72-\u0B77\u0BF0-\u0BF2\u0C78-\u0C7E\u0D70-\u0D75\u0F2A-\u0F33\u1369-\u137C\u17F0-\u17F9\u19DA\u2070\u2074-\u2079\u2080-\u2089\u2150-\u215F\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA830-\uA835',
            astral: '\uD802[\uDC58-\uDC5F\uDD16-\uDD1B\uDE40-\uDE47\uDE7D\uDE7E\uDF58-\uDF5F\uDF78-\uDF7F]|\uD834[\uDF60-\uDF71]|\uD803[\uDE60-\uDE7E]|\uD800[\uDD07-\uDD33\uDD75-\uDD78\uDD8A\uDF20-\uDF23]|\uD83C[\uDD00-\uDD0A]|\uD804[\uDC52-\uDC65]'
        },
        {
            name: 'P',
            alias: 'Punctuation',
            bmp: '\x21-\x23\x25-\\x2A\x2C-\x2F\x3A\x3B\\x3F\x40\\x5B-\\x5D\x5F\\x7B\x7D\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65',
            astral: '\uD809[\uDC70-\uDC73]|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDF39-\uDF3F]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDDC5-\uDDC8]'
        },
        {
            name: 'Pc',
            alias: 'Connector_Punctuation',
            bmp: '\x5F\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F'
        },
        {
            name: 'Pd',
            alias: 'Dash_Punctuation',
            bmp: '\\x2D\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D'
        },
        {
            name: 'Pe',
            alias: 'Close_Punctuation',
            bmp: '\\x29\\x5D\x7D\u0F3B\u0F3D\u169C\u2046\u207E\u208E\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E23\u2E25\u2E27\u2E29\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3F\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63'
        },
        {
            name: 'Pf',
            alias: 'Final_Punctuation',
            bmp: '\xBB\u2019\u201D\u203A\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21'
        },
        {
            name: 'Pi',
            alias: 'Initial_Punctuation',
            bmp: '\xAB\u2018\u201B\u201C\u201F\u2039\u2E02\u2E04\u2E09\u2E0C\u2E1C\u2E20'
        },
        {
            name: 'Po',
            alias: 'Other_Punctuation',
            bmp: '\x21-\x23\x25-\x27\\x2A\x2C\\x2E\x2F\x3A\x3B\\x3F\x40\\x5C\xA1\xA7\xB6\xB7\xBF\u037E\u0387\u055A-\u055F\u0589\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u166D\u166E\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u1805\u1807-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203B-\u203E\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205E\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00\u2E01\u2E06-\u2E08\u2E0B\u2E0E-\u2E16\u2E18\u2E19\u2E1B\u2E1E\u2E1F\u2E2A-\u2E2E\u2E30-\u2E39\u3001-\u3003\u303D\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFE10-\uFE16\uFE19\uFE30\uFE45\uFE46\uFE49-\uFE4C\uFE50-\uFE52\uFE54-\uFE57\uFE5F-\uFE61\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF07\uFF0A\uFF0C\uFF0E\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3C\uFF61\uFF64\uFF65',
            astral: '\uD809[\uDC70-\uDC73]|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDF39-\uDF3F]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDDC5-\uDDC8]'
        },
        {
            name: 'Ps',
            alias: 'Open_Punctuation',
            bmp: '\\x28\\x5B\\x7B\u0F3A\u0F3C\u169B\u201A\u201E\u2045\u207D\u208D\u2329\u2768\u276A\u276C\u276E\u2770\u2772\u2774\u27C5\u27E6\u27E8\u27EA\u27EC\u27EE\u2983\u2985\u2987\u2989\u298B\u298D\u298F\u2991\u2993\u2995\u2997\u29D8\u29DA\u29FC\u2E22\u2E24\u2E26\u2E28\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u3018\u301A\u301D\uFD3E\uFE17\uFE35\uFE37\uFE39\uFE3B\uFE3D\uFE3F\uFE41\uFE43\uFE47\uFE59\uFE5B\uFE5D\uFF08\uFF3B\uFF5B\uFF5F\uFF62'
        },
        {
            name: 'S',
            alias: 'Symbol',
            bmp: '\\x24\\x2B\x3C-\x3E\\x5E\x60\\x7C\x7E\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BA\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u2190-\u2328\u232B-\u23F3\u2400-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u26FF\u2701-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B4C\u2B50-\u2B59\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u32FE\u3300-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD',
            astral: '\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCF7\uDCF9-\uDCFC\uDD00-\uDD3D\uDD40-\uDD43\uDD50-\uDD67\uDDFB-\uDE40\uDE45-\uDE4F\uDE80-\uDEC5\uDF00-\uDF73]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBE\uDCC1-\uDCCF\uDCD1-\uDCDF\uDD10-\uDD2E\uDD30-\uDD6B\uDD70-\uDD9A\uDDE6-\uDE02\uDE10-\uDE3A\uDE40-\uDE48\uDE50\uDE51\uDF00-\uDF20\uDF30-\uDF35\uDF37-\uDF7C\uDF80-\uDF93\uDFA0-\uDFC4\uDFC6-\uDFCA\uDFE0-\uDFF0]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDDD\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD90-\uDD9B\uDDD0-\uDDFC]|\uD83B[\uDEF0\uDEF1]'
        },
        {
            name: 'Sc',
            alias: 'Currency_Symbol',
            bmp: '\\x24\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BA\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6'
        },
        {
            name: 'Sk',
            alias: 'Modifier_Symbol',
            bmp: '\\x5E\x60\xA8\xAF\xB4\xB8\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u309B\u309C\uA700-\uA716\uA720\uA721\uA789\uA78A\uFBB2-\uFBC1\uFF3E\uFF40\uFFE3'
        },
        {
            name: 'Sm',
            alias: 'Math_Symbol',
            bmp: '\\x2B\x3C-\x3E\\x7C\x7E\xAC\xB1\xD7\xF7\u03F6\u0606-\u0608\u2044\u2052\u207A-\u207C\u208A-\u208C\u2118\u2140-\u2144\u214B\u2190-\u2194\u219A\u219B\u21A0\u21A3\u21A6\u21AE\u21CE\u21CF\u21D2\u21D4\u21F4-\u22FF\u2308-\u230B\u2320\u2321\u237C\u239B-\u23B3\u23DC-\u23E1\u25B7\u25C1\u25F8-\u25FF\u266F\u27C0-\u27C4\u27C7-\u27E5\u27F0-\u27FF\u2900-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2AFF\u2B30-\u2B44\u2B47-\u2B4C\uFB29\uFE62\uFE64-\uFE66\uFF0B\uFF1C-\uFF1E\uFF5C\uFF5E\uFFE2\uFFE9-\uFFEC',
            astral: '\uD83B[\uDEF0\uDEF1]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]'
        },
        {
            name: 'So',
            alias: 'Other_Symbol',
            bmp: '\xA6\xA9\xAE\xB0\u0482\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u09FA\u0B70\u0BF3-\u0BF8\u0BFA\u0C7F\u0D79\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116\u2117\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u214A\u214C\u214D\u214F\u2195-\u2199\u219C-\u219F\u21A1\u21A2\u21A4\u21A5\u21A7-\u21AD\u21AF-\u21CD\u21D0\u21D1\u21D3\u21D5-\u21F3\u2300-\u2307\u230C-\u231F\u2322-\u2328\u232B-\u237B\u237D-\u239A\u23B4-\u23DB\u23E2-\u23F3\u2400-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u25B6\u25B8-\u25C0\u25C2-\u25F7\u2600-\u266E\u2670-\u26FF\u2701-\u2767\u2794-\u27BF\u2800-\u28FF\u2B00-\u2B2F\u2B45\u2B46\u2B50-\u2B59\u2CE5-\u2CEA\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u32FE\u3300-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA828-\uA82B\uA836\uA837\uA839\uAA77-\uAA79\uFDFD\uFFE4\uFFE8\uFFED\uFFEE\uFFFC\uFFFD',
            astral: '\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCF7\uDCF9-\uDCFC\uDD00-\uDD3D\uDD40-\uDD43\uDD50-\uDD67\uDDFB-\uDE40\uDE45-\uDE4F\uDE80-\uDEC5\uDF00-\uDF73]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDDD\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBE\uDCC1-\uDCCF\uDCD1-\uDCDF\uDD10-\uDD2E\uDD30-\uDD6B\uDD70-\uDD9A\uDDE6-\uDE02\uDE10-\uDE3A\uDE40-\uDE48\uDE50\uDE51\uDF00-\uDF20\uDF30-\uDF35\uDF37-\uDF7C\uDF80-\uDF93\uDFA0-\uDFC4\uDFC6-\uDFCA\uDFE0-\uDFF0]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD90-\uDD9B\uDDD0-\uDDFC]'
        },
        {
            name: 'Z',
            alias: 'Separator',
            bmp: '\x20\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000'
        },
        {
            name: 'Zl',
            alias: 'Line_Separator',
            bmp: '\u2028'
        },
        {
            name: 'Zp',
            alias: 'Paragraph_Separator',
            bmp: '\u2029'
        },
        {
            name: 'Zs',
            alias: 'Space_Separator',
            bmp: '\x20\xA0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000'
        }
    ]);

}(XRegExp));

/*!
 * XRegExp Unicode Properties 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2012 MIT License
 * Uses Unicode 6.2.0 <http://unicode.org/>
 * Unicode data generated by Mathias Bynens <http://mathiasbynens.be/>
 */

/**
 * Adds Level 1 Unicode properties (detailed in UTS #18 RL1.2). Token names are case insensitive,
 * and any spaces, hyphens, and underscores are ignored.
 * @requires XRegExp, Unicode Base
 */
(function(XRegExp) {
    'use strict';

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Properties');
    }

    XRegExp.addUnicodeData([
        {
            name: 'ASCII',
            bmp: '\0-\x7F'
        },
        {
            name: 'Alphabetic',
            bmp: 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0345\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0657\u0659-\u065F\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06ED-\u06EF\u06FA-\u06FC\u06FF\u0710-\u073F\u074D-\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0817\u081A-\u082C\u0840-\u0858\u08A0\u08A2-\u08AC\u08E4-\u08E9\u08F0-\u08FE\u0900-\u093B\u093D-\u094C\u094E-\u0950\u0955-\u0963\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C4\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B\u0A4C\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC5\u0AC7-\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0-\u0AE3\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D-\u0B44\u0B47\u0B48\u0B4B\u0B4C\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4C\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCC\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D57\u0D60-\u0D63\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E46\u0E4D\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0ECD\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F81\u0F88-\u0F97\u0F99-\u0FBC\u1000-\u1036\u1038\u103B-\u103F\u1050-\u1062\u1065-\u1068\u106E-\u1086\u108E\u109C\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1713\u1720-\u1733\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17B3\u17B6-\u17C8\u17D7\u17DC\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u1938\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A61-\u1A74\u1AA7\u1B00-\u1B33\u1B35-\u1B43\u1B45-\u1B4B\u1B80-\u1BA9\u1BAC-\u1BAF\u1BBA-\u1BE5\u1BE7-\u1BF1\u1C00-\u1C35\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA674-\uA67B\uA67F-\uA697\uA69F-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA827\uA840-\uA873\uA880-\uA8C3\uA8F2-\uA8F7\uA8FB\uA90A-\uA92A\uA930-\uA952\uA960-\uA97C\uA980-\uA9B2\uA9B4-\uA9BF\uA9CF\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A\uAA80-\uAABE\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
            astral: '\uD803[\uDC00-\uDC48]|\uD801[\uDC00-\uDC9D]|\uD809[\uDC00-\uDC62]|\uD81A[\uDC00-\uDE38]|\uD804[\uDC00-\uDC45\uDC82-\uDCB8\uDCD0-\uDCE8\uDD00-\uDD32\uDD80-\uDDBF\uDDC1-\uDDC4]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD87E[\uDC00-\uDE1D]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1E\uDF30-\uDF4A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF93-\uDF9F]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD82C[\uDC00\uDC01]|\uD808[\uDC00-\uDF6E]|\uD805[\uDE80-\uDEB5]'
        },
        // Assert: In BMP-only mode, `[\P{Any}]` (inverted Any within a character class) compiles to `[]`
        {
            name: 'Any',
            isBmpLast: true,
            bmp: '\0-\uFFFF',
            astral: '[\uD800-\uDBFF][\uDC00-\uDFFF]'
        },
        // Defined as the inverse of Unicode category Cn (Unassigned)
        {
            name: 'Assigned',
            inverseOf: 'Cn'
        },
        {
            name: 'Default_Ignorable_Code_Point',
            bmp: '\xAD\u034F\u115F\u1160\u17B4\u17B5\u180B-\u180D\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFE00-\uFE0F\uFEFF\uFFA0\uFFF0-\uFFF8',
            astral: '[\uDB40-\uDB43][\uDC00-\uDFFF]|\uD834[\uDD73-\uDD7A]'
        },
        {
            name: 'Lowercase',
            bmp: 'a-z\xAA\xB5\xBA\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02B8\u02C0\u02C1\u02E0-\u02E4\u0345\u0371\u0373\u0377\u037A-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1DBF\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u2071\u207F\u2090-\u209C\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2170-\u217F\u2184\u24D0-\u24E9\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7D\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7F8-\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A',
            astral: '\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD801[\uDC28-\uDC4F]'
        },
        {
            name: 'Noncharacter_Code_Point',
            bmp: '\uFDD0-\uFDEF\uFFFE\uFFFF',
            astral: '[\uDB3F\uDB7F\uDBBF\uDBFF\uD83F\uD87F\uD8BF\uDAFF\uD97F\uD9BF\uD9FF\uDA3F\uD8FF\uDABF\uDA7F\uD93F][\uDFFE\uDFFF]'
        },
        {
            name: 'Uppercase',
            bmp: 'A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2160-\u216F\u2183\u24B6-\u24CF\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A',
            astral: '\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD801[\uDC00-\uDC27]'
        },
        {
            name: 'White_Space',
            bmp: '\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000'
        }
    ]);

}(XRegExp));

/*!
 * XRegExp Unicode Scripts 3.0.0-pre
 * <http://xregexp.com/>
 * Steven Levithan � 2010-2012 MIT License
 * Uses Unicode 6.2.0 <http://unicode.org/>
 * Unicode data generated by Mathias Bynens <http://mathiasbynens.be/>
 */

/**
 * Adds support for all Unicode scripts. E.g., `\p{Latin}`. Token names are case insensitive, and
 * any spaces, hyphens, and underscores are ignored.
 * @requires XRegExp, Unicode Base
 */
(function(XRegExp) {
    'use strict';

    if (!XRegExp.addUnicodeData) {
        throw new ReferenceError('Unicode Base must be loaded before Unicode Scripts');
    }

    XRegExp.addUnicodeData([
        {
            name: 'Arabic',
            bmp: '\u0600-\u0604\u0606-\u060B\u060D-\u061A\u061E\u0620-\u063F\u0641-\u064A\u0656-\u065F\u066A-\u066F\u0671-\u06DC\u06DE-\u06FF\u0750-\u077F\u08A0\u08A2-\u08AC\u08E4-\u08FE\uFB50-\uFBC1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC',
            astral: '\uD803[\uDE60-\uDE7E]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB\uDEF0\uDEF1]'
        },
        {
            name: 'Armenian',
            bmp: '\u0531-\u0556\u0559-\u055F\u0561-\u0587\u058A\u058F\uFB13-\uFB17'
        },
        {
            name: 'Avestan',
            astral: '\uD802[\uDF00-\uDF35\uDF39-\uDF3F]'
        },
        {
            name: 'Balinese',
            bmp: '\u1B00-\u1B4B\u1B50-\u1B7C'
        },
        {
            name: 'Bamum',
            bmp: '\uA6A0-\uA6F7',
            astral: '\uD81A[\uDC00-\uDE38]'
        },
        {
            name: 'Batak',
            bmp: '\u1BC0-\u1BF3\u1BFC-\u1BFF'
        },
        {
            name: 'Bengali',
            bmp: '\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FB'
        },
        {
            name: 'Bopomofo',
            bmp: '\u02EA\u02EB\u3105-\u312D\u31A0-\u31BA'
        },
        {
            name: 'Brahmi',
            astral: '\uD804[\uDC00-\uDC4D\uDC52-\uDC6F]'
        },
        {
            name: 'Braille',
            bmp: '\u2800-\u28FF'
        },
        {
            name: 'Buginese',
            bmp: '\u1A00-\u1A1B\u1A1E\u1A1F'
        },
        {
            name: 'Buhid',
            bmp: '\u1740-\u1753'
        },
        {
            name: 'Canadian_Aboriginal',
            bmp: '\u1400-\u167F\u18B0-\u18F5'
        },
        {
            name: 'Carian',
            astral: '\uD800[\uDEA0-\uDED0]'
        },
        {
            name: 'Chakma',
            astral: '\uD804[\uDD00-\uDD34\uDD36-\uDD43]'
        },
        {
            name: 'Cham',
            bmp: '\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA5C-\uAA5F'
        },
        {
            name: 'Cherokee',
            bmp: '\u13A0-\u13F4'
        },
        {
            name: 'Common',
            bmp: '\0-\x40\\x5B-\x60\\x7B-\xA9\xAB-\xB9\xBB-\xBF\xD7\xF7\u02B9-\u02DF\u02E5-\u02E9\u02EC-\u02FF\u0374\u037E\u0385\u0387\u0589\u060C\u061B\u061F\u0640\u0660-\u0669\u06DD\u0964\u0965\u0E3F\u0FD5-\u0FD8\u10FB\u16EB-\u16ED\u1735\u1736\u1802\u1803\u1805\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u2000-\u200B\u200E-\u2064\u206A-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20BA\u2100-\u2125\u2127-\u2129\u212C-\u2131\u2133-\u214D\u214F-\u215F\u2189\u2190-\u23F3\u2400-\u2426\u2440-\u244A\u2460-\u26FF\u2701-\u27FF\u2900-\u2B4C\u2B50-\u2B59\u2E00-\u2E3B\u2FF0-\u2FFB\u3000-\u3004\u3006\u3008-\u3020\u3030-\u3037\u303C-\u303F\u309B\u309C\u30A0\u30FB\u30FC\u3190-\u319F\u31C0-\u31E3\u3220-\u325F\u327F-\u32CF\u3358-\u33FF\u4DC0-\u4DFF\uA700-\uA721\uA788-\uA78A\uA830-\uA839\uFD3E\uFD3F\uFDFD\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFF70\uFF9E\uFF9F\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD',
            astral: '\uD800[\uDD00-\uDD02\uDD07-\uDD33\uDD37-\uDD3F\uDD90-\uDD9B\uDDD0-\uDDFC]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBE\uDCC1-\uDCCF\uDCD1-\uDCDF\uDD00-\uDD0A\uDD10-\uDD2E\uDD30-\uDD6B\uDD70-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE10-\uDE3A\uDE40-\uDE48\uDE50\uDE51\uDF00-\uDF20\uDF30-\uDF35\uDF37-\uDF7C\uDF80-\uDF93\uDFA0-\uDFC4\uDFC6-\uDFCA\uDFE0-\uDFF0]|\uDB40[\uDC01\uDC20-\uDC7F]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDFCB\uDFCE-\uDFFF]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD66\uDD6A-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDDD\uDF00-\uDF56\uDF60-\uDF71]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCF7\uDCF9-\uDCFC\uDD00-\uDD3D\uDD40-\uDD43\uDD50-\uDD67\uDDFB-\uDE40\uDE45-\uDE4F\uDE80-\uDEC5\uDF00-\uDF73]'
        },
        {
            name: 'Coptic',
            bmp: '\u03E2-\u03EF\u2C80-\u2CF3\u2CF9-\u2CFF'
        },
        {
            name: 'Cuneiform',
            astral: '\uD809[\uDC00-\uDC62\uDC70-\uDC73]|\uD808[\uDC00-\uDF6E]'
        },
        {
            name: 'Cypriot',
            astral: '\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F]'
        },
        {
            name: 'Cyrillic',
            bmp: '\u0400-\u0484\u0487-\u0527\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA697\uA69F'
        },
        {
            name: 'Deseret',
            astral: '\uD801[\uDC00-\uDC4F]'
        },
        {
            name: 'Devanagari',
            bmp: '\u0900-\u0950\u0953-\u0963\u0966-\u0977\u0979-\u097F\uA8E0-\uA8FB'
        },
        {
            name: 'Egyptian_Hieroglyphs',
            astral: '\uD80C[\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]'
        },
        {
            name: 'Ethiopic',
            bmp: '\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E'
        },
        {
            name: 'Georgian',
            bmp: '\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u10FF\u2D00-\u2D25\u2D27\u2D2D'
        },
        {
            name: 'Glagolitic',
            bmp: '\u2C00-\u2C2E\u2C30-\u2C5E'
        },
        {
            name: 'Gothic',
            astral: '\uD800[\uDF30-\uDF4A]'
        },
        {
            name: 'Greek',
            bmp: '\u0370-\u0373\u0375-\u0377\u037A-\u037D\u0384\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03E1\u03F0-\u03FF\u1D26-\u1D2A\u1D5D-\u1D61\u1D66-\u1D6A\u1DBF\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u2126',
            astral: '\uD834[\uDE00-\uDE45]|\uD800[\uDD40-\uDD8A]'
        },
        {
            name: 'Gujarati',
            bmp: '\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1'
        },
        {
            name: 'Gurmukhi',
            bmp: '\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75'
        },
        {
            name: 'Han',
            bmp: '\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u3005\u3007\u3021-\u3029\u3038-\u303B\u3400-\u4DB5\u4E00-\u9FCC\uF900-\uFA6D\uFA70-\uFAD9',
            astral: '[\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD87E[\uDC00-\uDE1D]'
        },
        {
            name: 'Hangul',
            bmp: '\u1100-\u11FF\u302E\u302F\u3131-\u318E\u3200-\u321E\u3260-\u327E\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC'
        },
        {
            name: 'Hanunoo',
            bmp: '\u1720-\u1734'
        },
        {
            name: 'Hebrew',
            bmp: '\u0591-\u05C7\u05D0-\u05EA\u05F0-\u05F4\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFB4F'
        },
        {
            name: 'Hiragana',
            bmp: '\u3041-\u3096\u309D-\u309F',
            astral: '\uD82C\uDC01|\uD83C\uDE00'
        },
        {
            name: 'Imperial_Aramaic',
            astral: '\uD802[\uDC40-\uDC55\uDC57-\uDC5F]'
        },
        {
            name: 'Inherited',
            bmp: '\u0300-\u036F\u0485\u0486\u064B-\u0655\u0670\u0951\u0952\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1DC0-\u1DE6\u1DFC-\u1DFF\u200C\u200D\u20D0-\u20F0\u302A-\u302D\u3099\u309A\uFE00-\uFE0F\uFE20-\uFE26',
            astral: '\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD]|\uD800\uDDFD|\uDB40[\uDD00-\uDDEF]'
        },
        {
            name: 'Inscriptional_Pahlavi',
            astral: '\uD802[\uDF60-\uDF72\uDF78-\uDF7F]'
        },
        {
            name: 'Inscriptional_Parthian',
            astral: '\uD802[\uDF40-\uDF55\uDF58-\uDF5F]'
        },
        {
            name: 'Javanese',
            bmp: '\uA980-\uA9CD\uA9CF-\uA9D9\uA9DE\uA9DF'
        },
        {
            name: 'Kaithi',
            astral: '\uD804[\uDC80-\uDCC1]'
        },
        {
            name: 'Kannada',
            bmp: '\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2'
        },
        {
            name: 'Katakana',
            bmp: '\u30A1-\u30FA\u30FD-\u30FF\u31F0-\u31FF\u32D0-\u32FE\u3300-\u3357\uFF66-\uFF6F\uFF71-\uFF9D',
            astral: '\uD82C\uDC00'
        },
        {
            name: 'Kayah_Li',
            bmp: '\uA900-\uA92F'
        },
        {
            name: 'Kharoshthi',
            astral: '\uD802[\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F-\uDE47\uDE50-\uDE58]'
        },
        {
            name: 'Khmer',
            bmp: '\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u19E0-\u19FF'
        },
        {
            name: 'Lao',
            bmp: '\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF'
        },
        {
            name: 'Latin',
            bmp: 'A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA7FF\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A'
        },
        {
            name: 'Lepcha',
            bmp: '\u1C00-\u1C37\u1C3B-\u1C49\u1C4D-\u1C4F'
        },
        {
            name: 'Limbu',
            bmp: '\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1940\u1944-\u194F'
        },
        {
            name: 'Linear_B',
            astral: '\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA]'
        },
        {
            name: 'Lisu',
            bmp: '\uA4D0-\uA4FF'
        },
        {
            name: 'Lycian',
            astral: '\uD800[\uDE80-\uDE9C]'
        },
        {
            name: 'Lydian',
            astral: '\uD802[\uDD20-\uDD39\uDD3F]'
        },
        {
            name: 'Malayalam',
            bmp: '\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D75\u0D79-\u0D7F'
        },
        {
            name: 'Mandaic',
            bmp: '\u0840-\u085B\u085E'
        },
        {
            name: 'Meetei_Mayek',
            bmp: '\uAAE0-\uAAF6\uABC0-\uABED\uABF0-\uABF9'
        },
        {
            name: 'Meroitic_Cursive',
            astral: '\uD802[\uDDA0-\uDDB7\uDDBE\uDDBF]'
        },
        {
            name: 'Meroitic_Hieroglyphs',
            astral: '\uD802[\uDD80-\uDD9F]'
        },
        {
            name: 'Miao',
            astral: '\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]'
        },
        {
            name: 'Mongolian',
            bmp: '\u1800\u1801\u1804\u1806-\u180E\u1810-\u1819\u1820-\u1877\u1880-\u18AA'
        },
        {
            name: 'Myanmar',
            bmp: '\u1000-\u109F\uAA60-\uAA7B'
        },
        {
            name: 'New_Tai_Lue',
            bmp: '\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u19DE\u19DF'
        },
        {
            name: 'Nko',
            bmp: '\u07C0-\u07FA'
        },
        {
            name: 'Ogham',
            bmp: '\u1680-\u169C'
        },
        {
            name: 'Ol_Chiki',
            bmp: '\u1C50-\u1C7F'
        },
        {
            name: 'Old_Italic',
            astral: '\uD800[\uDF00-\uDF1E\uDF20-\uDF23]'
        },
        {
            name: 'Old_Persian',
            astral: '\uD800[\uDFA0-\uDFC3\uDFC8-\uDFD5]'
        },
        {
            name: 'Old_South_Arabian',
            astral: '\uD802[\uDE60-\uDE7F]'
        },
        {
            name: 'Old_Turkic',
            astral: '\uD803[\uDC00-\uDC48]'
        },
        {
            name: 'Oriya',
            bmp: '\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77'
        },
        {
            name: 'Osmanya',
            astral: '\uD801[\uDC80-\uDC9D\uDCA0-\uDCA9]'
        },
        {
            name: 'Phags_Pa',
            bmp: '\uA840-\uA877'
        },
        {
            name: 'Phoenician',
            astral: '\uD802[\uDD00-\uDD1B\uDD1F]'
        },
        {
            name: 'Rejang',
            bmp: '\uA930-\uA953\uA95F'
        },
        {
            name: 'Runic',
            bmp: '\u16A0-\u16EA\u16EE-\u16F0'
        },
        {
            name: 'Samaritan',
            bmp: '\u0800-\u082D\u0830-\u083E'
        },
        {
            name: 'Saurashtra',
            bmp: '\uA880-\uA8C4\uA8CE-\uA8D9'
        },
        {
            name: 'Sharada',
            astral: '\uD804[\uDD80-\uDDC8\uDDD0-\uDDD9]'
        },
        {
            name: 'Shavian',
            astral: '\uD801[\uDC50-\uDC7F]'
        },
        {
            name: 'Sinhala',
            bmp: '\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2-\u0DF4'
        },
        {
            name: 'Sora_Sompeng',
            astral: '\uD804[\uDCD0-\uDCE8\uDCF0-\uDCF9]'
        },
        {
            name: 'Sundanese',
            bmp: '\u1B80-\u1BBF\u1CC0-\u1CC7'
        },
        {
            name: 'Syloti_Nagri',
            bmp: '\uA800-\uA82B'
        },
        {
            name: 'Syriac',
            bmp: '\u0700-\u070D\u070F-\u074A\u074D-\u074F'
        },
        {
            name: 'Tagalog',
            bmp: '\u1700-\u170C\u170E-\u1714'
        },
        {
            name: 'Tagbanwa',
            bmp: '\u1760-\u176C\u176E-\u1770\u1772\u1773'
        },
        {
            name: 'Tai_Le',
            bmp: '\u1950-\u196D\u1970-\u1974'
        },
        {
            name: 'Tai_Tham',
            bmp: '\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD'
        },
        {
            name: 'Tai_Viet',
            bmp: '\uAA80-\uAAC2\uAADB-\uAADF'
        },
        {
            name: 'Takri',
            astral: '\uD805[\uDE80-\uDEB7\uDEC0-\uDEC9]'
        },
        {
            name: 'Tamil',
            bmp: '\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA'
        },
        {
            name: 'Telugu',
            bmp: '\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C78-\u0C7F'
        },
        {
            name: 'Thaana',
            bmp: '\u0780-\u07B1'
        },
        {
            name: 'Thai',
            bmp: '\u0E01-\u0E3A\u0E40-\u0E5B'
        },
        {
            name: 'Tibetan',
            bmp: '\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FD4\u0FD9\u0FDA'
        },
        {
            name: 'Tifinagh',
            bmp: '\u2D30-\u2D67\u2D6F\u2D70\u2D7F'
        },
        {
            name: 'Ugaritic',
            astral: '\uD800[\uDF80-\uDF9D\uDF9F]'
        },
        {
            name: 'Vai',
            bmp: '\uA500-\uA62B'
        },
        {
            name: 'Yi',
            bmp: '\uA000-\uA48C\uA490-\uA4C6'
        }
    ]);

}(XRegExp));

return XRegExp;

}));


})()
},{}],8:[function(require,module,exports){
exports.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                  'Oct', 'Nov', 'Dec'];

exports.isNotEmpty = function(str) {
  return str.trim().length > 0;
};

exports.escape = function(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
};

exports.unescape = function(str) {
  return str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
};

exports.buildSearchQuery = function(options, extensions, isOrChild) {
  var searchargs = '';
  for (var i=0,len=options.length; i<len; i++) {
    var criteria = (isOrChild ? options : options[i]),
        args = null,
        modifier = (isOrChild ? '' : ' ');
    if (typeof criteria === 'string')
      criteria = criteria.toUpperCase();
    else if (Array.isArray(criteria)) {
      if (criteria.length > 1)
        args = criteria.slice(1);
      if (criteria.length > 0)
        criteria = criteria[0].toUpperCase();
    } else
      throw new Error('Unexpected search option data type. '
                      + 'Expected string or array. Got: ' + typeof criteria);
    if (criteria === 'OR') {
      if (args.length !== 2)
        throw new Error('OR must have exactly two arguments');
      searchargs += ' OR (';
      searchargs += exports.buildSearchQuery(args[0], extensions, true);
      searchargs += ') (';
      searchargs += exports.buildSearchQuery(args[1], extensions, true);
      searchargs += ')';
    } else {
      if (criteria[0] === '!') {
        modifier += 'NOT ';
        criteria = criteria.substr(1);
      }
      switch(criteria) {
        // -- Standard criteria --
        case 'ALL':
        case 'ANSWERED':
        case 'DELETED':
        case 'DRAFT':
        case 'FLAGGED':
        case 'NEW':
        case 'SEEN':
        case 'RECENT':
        case 'OLD':
        case 'UNANSWERED':
        case 'UNDELETED':
        case 'UNDRAFT':
        case 'UNFLAGGED':
        case 'UNSEEN':
          searchargs += modifier + criteria;
        break;
        case 'BCC':
        case 'BODY':
        case 'CC':
        case 'FROM':
        case 'SUBJECT':
        case 'TEXT':
        case 'TO':
          if (!args || args.length !== 1)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          searchargs += modifier + criteria + ' "' + exports.escape(''+args[0])
                     + '"';
        break;
        case 'BEFORE':
        case 'ON':
        case 'SENTBEFORE':
        case 'SENTON':
        case 'SENTSINCE':
        case 'SINCE':
          if (!args || args.length !== 1)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          else if (!(args[0] instanceof Date)) {
            if ((args[0] = new Date(args[0])).toString() === 'Invalid Date')
              throw new Error('Search option argument must be a Date object'
                              + ' or a parseable date string');
          }
          searchargs += modifier + criteria + ' ' + args[0].getDate() + '-'
                        + exports.MONTHS[args[0].getMonth()] + '-'
                        + args[0].getFullYear();
        break;
        case 'KEYWORD':
        case 'UNKEYWORD':
          if (!args || args.length !== 1)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          searchargs += modifier + criteria + ' ' + args[0];
        break;
        case 'LARGER':
        case 'SMALLER':
          if (!args || args.length !== 1)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          var num = parseInt(args[0], 10);
          if (isNaN(num))
            throw new Error('Search option argument must be a number');
          searchargs += modifier + criteria + ' ' + args[0];
        break;
        case 'HEADER':
          if (!args || args.length !== 2)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          searchargs += modifier + criteria + ' "' + exports.escape(''+args[0])
                     + '" "' + exports.escape(''+args[1]) + '"';
        break;
        case 'UID':
          if (!args)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          exports.validateUIDList(args);
          searchargs += modifier + criteria + ' ' + args.join(',');
        break;
        // -- Extensions criteria --
        case 'X-GM-MSGID': // Gmail unique message ID
        case 'X-GM-THRID': // Gmail thread ID
          if (extensions.indexOf('X-GM-EXT-1') === -1)
            throw new Error('IMAP extension not available: ' + criteria);
          var val;
          if (!args || args.length !== 1)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          else {
            val = ''+args[0];
            if (!(/^\d+$/.test(args[0])))
              throw new Error('Invalid value');
          }
          searchargs += modifier + criteria + ' ' + val;
        break;
        case 'X-GM-RAW': // Gmail search syntax
          if (extensions.indexOf('X-GM-EXT-1') === -1)
            throw new Error('IMAP extension not available: ' + criteria);
          if (!args || args.length !== 1)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          searchargs += modifier + criteria + ' "' + exports.escape(''+args[0])
                     + '"';
        break;
        case 'X-GM-LABELS': // Gmail labels
          if (extensions.indexOf('X-GM-EXT-1') === -1)
            throw new Error('IMAP extension not available: ' + criteria);
          if (!args || args.length !== 1)
            throw new Error('Incorrect number of arguments for search option: '
                            + criteria);
          searchargs += modifier + criteria + ' ' + args[0];
        break;
        default:
          try {
            // last hope it's a seqno set
            // http://tools.ietf.org/html/rfc3501#section-6.4.4
            var seqnos = (args ? [criteria].concat(args) : [criteria]);
            exports.validateUIDList(seqnos);
            searchargs += modifier + seqnos.join(',');
          } catch(e) {
            throw new Error('Unexpected search option: ' + criteria);
          }
      }
    }
    if (isOrChild)
      break;
  }
  return searchargs;
};

exports.validateUIDList = function(uids) {
  for (var i=0,len=uids.length,intval; i<len; i++) {
    if (typeof uids[i] === 'string') {
      if (uids[i] === '*' || uids[i] === '*:*') {
        if (len > 1)
          uids = ['*'];
        break;
      } else if (/^(?:[\d]+|\*):(?:[\d]+|\*)$/.test(uids[i]))
        continue;
    }
    intval = parseInt(''+uids[i], 10);
    if (isNaN(intval)) {
      throw new Error('Message ID/number must be an integer, "*", or a range: '
                      + uids[i]);
    } else if (typeof uids[i] !== 'number')
      uids[i] = intval;
  }
};

var CHARR_CRLF = [13, 10];
function line(b, s) {
  var len = b.length, p = b.p, start = p, ret = false, retest = false;
  while (p < len && !ret) {
    if (b.get(p) === CHARR_CRLF[s.p]) {
      if (++s.p === 2)
        ret = true;
    } else {
      retest = (s.p > 0);
      s.p = 0;
      if (retest)
        continue;
    }
    ++p;
  }
  if (ret === false) {
    if (s.ret)
      s.ret += b.toString('ascii', start);
    else
      s.ret = b.toString('ascii', start);
  } else {
    var iCR = p - 2;
    if (iCR < 0) {
      // the CR is at the end of s.ret
      if (s.ret && s.ret.length > 1)
        ret = s.ret.substr(0, s.ret.length - 1);
      else
        ret = '';
    } else {
      // the entire CRLF is in b
      if (iCR === 0)
        ret = (s.ret ? s.ret : '');
      else {
        if (s.ret) {
          ret = s.ret;
          ret += b.toString('ascii', start, iCR);
        } else
          ret = b.toString('ascii', start, iCR);
      }
    }
    s.p = 0;
    s.ret = undefined;
  }
  b.p = p;
  return ret;
}

exports.line = line;

},{}],9:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],2:[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.binaryWrite = SlowBuffer.prototype.asciiWrite;

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.binarySlice = SlowBuffer.prototype.asciiSlice;

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

SlowBuffer.prototype.fill = function(value, start, end) {
  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this.parent[i + this.offset] = subject.readUInt8(i);
        }
        else {
          this.parent[i + this.offset] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1];
    }
  } else {
    val = buffer.parent[buffer.offset + offset];
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer.parent[buffer.offset + offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":"P++JCd","./buffer_ieee754":9,"base64-js":10}],11:[function(require,module,exports){
var utils = require('./imap.utilities');

var RE_CRLF = /\r\n/g,
    RE_HDR = /^([^:]+):[ \t]?(.+)?$/;

exports.convStr = function(str, literals) {
  if (str[0] === '"')
    return str.substring(1, str.length-1);
  else if (str === 'NIL')
    return null;
  else if (/^\d+$/.test(str)) {
    // some IMAP extensions utilize large (64-bit) integers, which JavaScript
    // can't handle natively, so we'll just keep it as a string if it's too big
    var val = parseInt(str, 10);
    return (val.toString() === str ? val : str);
  } else if (literals && literals.lp < literals.length && /^\{\d+\}$/.test(str))
    return literals[literals.lp++];
  else
    return str;
};

exports.parseHeaders = function(str) {
  var lines = str.split(RE_CRLF),
      headers = {}, m;

  for (var i = 0, h, len = lines.length; i < len; ++i) {
    if (lines[i].length === 0)
      continue;
    if (lines[i][0] === '\t' || lines[i][0] === ' ') {
      // folded header content
      // RFC2822 says to just remove the CRLF and not the whitespace following
      // it, so we follow the RFC and include the leading whitespace ...
      headers[h][headers[h].length - 1] += lines[i];
    } else {
      m = RE_HDR.exec(lines[i]);
      h = m[1].toLowerCase();
      if (m[2]) {
        if (headers[h] === undefined)
          headers[h] = [m[2]];
        else
          headers[h].push(m[2]);
      } else
        headers[h] = [''];
    }
  }
  return headers;
};

exports.parseNamespaces = function(str, literals) {
  var result, vals;
  if (str.length === 3 && str.toUpperCase() === 'NIL')
    vals = null;
  else {
    result = exports.parseExpr(str, literals);
    vals = [];
    for (var i = 0, len = result.length; i < len; ++i) {
      var val = {
        prefix: result[i][0],
        delimiter: result[i][1]
      };
      if (result[i].length > 2) {
        // extension data
        val.extensions = [];
        for (var j = 2, len2 = result[i].length; j < len2; j += 2) {
          val.extensions.push({
            name: result[i][j],
            flags: result[i][j + 1]
          });
        }
      }
      vals.push(val);
    }
  }
  return vals;
};

exports.parseFetchBodies = function(str, literals) {
  literals.lp = 0;
  var result = exports.parseExpr(str, literals),
      bodies;
  for (var i = 0, len = result.length; i < len; i += 2) {
    if (Array.isArray(result[i])) {
      if (result[i].length === 0)
        result[i].push('');
      else if (result[i].length > 1) {
        // HEADER.FIELDS (foo) or HEADER.FIELDS (foo bar baz)
        result[i][0] += ' (';
        if (Array.isArray(result[i][1]))
          result[i][0] += result[i][1].join(' ');
        else
          result[i][0] += result[i].slice(1).join(' ');
        result[i][0] += ')';
      }
      if (bodies === undefined)
        bodies = ['BODY[' + result[i][0] + ']', result[i + 1]];
      else {
        bodies.push('BODY[' + result[i][0] + ']');
        bodies.push(result[i + 1]);
      }
    }
  }
  return bodies;
};

exports.parseFetch = function(str, literals, fetchData) {
  literals.lp = 0;
  var result = exports.parseExpr(str, literals, false, 0, false);
  for (var i = 0, len = result.length; i < len; i += 2) {
    result[i] = result[i].toUpperCase();
    if (/^BODY\[/.test(result[i]))
      continue;
    if (result[i] === 'UID')
      fetchData.uid = parseInt(result[i + 1], 10);
    else if (result[i] === 'INTERNALDATE')
      fetchData.date = result[i + 1];
    else if (result[i] === 'FLAGS')
      fetchData.flags = result[i + 1].filter(utils.isNotEmpty);
    else if (result[i] === 'BODYSTRUCTURE')
      fetchData.structure = exports.parseBodyStructure(result[i + 1], literals);
    else if (result[i] === 'RFC822.SIZE')
      fetchData.size = parseInt(result[i + 1], 10);
    else if (typeof result[i] === 'string') // simple extensions
      fetchData[result[i].toLowerCase()] = result[i + 1];
  }
};

exports.parseBodyStructure = function(cur, literals, prefix, partID) {
  var ret = [], i, len;
  if (prefix === undefined) {
    var result = (Array.isArray(cur) ? cur : exports.parseExpr(cur, literals));
    if (result.length)
      ret = exports.parseBodyStructure(result, literals, '', 1);
  } else {
    var part, partLen = cur.length, next;
    if (Array.isArray(cur[0])) { // multipart
      next = -1;
      while (Array.isArray(cur[++next])) {
        ret.push(exports.parseBodyStructure(cur[next], literals, prefix
                                                    + (prefix !== '' ? '.' : '')
                                                    + (partID++).toString(), 1));
      }
      part = { type: cur[next++].toLowerCase() };
      if (partLen > next) {
        if (Array.isArray(cur[next])) {
          part.params = {};
          for (i = 0, len = cur[next].length; i < len; i += 2)
            part.params[cur[next][i].toLowerCase()] = cur[next][i + 1];
        } else
          part.params = cur[next];
        ++next;
      }
    } else { // single part
      next = 7;
      if (typeof cur[1] === 'string') {
        part = {
          // the path identifier for this part, useful for fetching specific
          // parts of a message
          partID: (prefix !== '' ? prefix : '1'),

          // required fields as per RFC 3501 -- null or otherwise
          type: cur[0].toLowerCase(), subtype: cur[1].toLowerCase(),
          params: null, id: cur[3], description: cur[4], encoding: cur[5],
          size: cur[6]
        };
      } else {
        // type information for malformed multipart body
        part = { type: cur[0].toLowerCase(), params: null };
        cur.splice(1, 0, null);
        ++partLen;
        next = 2;
      }
      if (Array.isArray(cur[2])) {
        part.params = {};
        for (i = 0, len = cur[2].length; i < len; i += 2)
          part.params[cur[2][i].toLowerCase()] = cur[2][i + 1];
        if (cur[1] === null)
          ++next;
      }
      if (part.type === 'message' && part.subtype === 'rfc822') {
        // envelope
        if (partLen > next && Array.isArray(cur[next])) {
          part.envelope = {};
          for (i = 0, len = cur[next].length; i < len; ++i) {
            if (i === 0)
              part.envelope.date = cur[next][i];
            else if (i === 1)
              part.envelope.subject = cur[next][i];
            else if (i >= 2 && i <= 7) {
              var val = cur[next][i];
              if (Array.isArray(val)) {
                var addresses = [], inGroup = false, curGroup;
                for (var j = 0, len2 = val.length; j < len2; ++j) {
                  if (val[j][3] === null) { // start group addresses
                    inGroup = true;
                    curGroup = {
                      group: val[j][2],
                      addresses: []
                    };
                  } else if (val[j][2] === null) { // end of group addresses
                    inGroup = false;
                    addresses.push(curGroup);
                  } else { // regular user address
                    var info = {
                      name: val[j][0],
                      mailbox: val[j][2],
                      host: val[j][3]
                    };
                    if (inGroup)
                      curGroup.addresses.push(info);
                    else
                      addresses.push(info);
                  }
                }
                val = addresses;
              }
              if (i === 2)
                part.envelope.from = val;
              else if (i === 3)
                part.envelope.sender = val;
              else if (i === 4)
                part.envelope['reply-to'] = val;
              else if (i === 5)
                part.envelope.to = val;
              else if (i === 6)
                part.envelope.cc = val;
              else if (i === 7)
                part.envelope.bcc = val;
            } else if (i === 8)
              // message ID being replied to
              part.envelope['in-reply-to'] = cur[next][i];
            else if (i === 9)
              part.envelope['message-id'] = cur[next][i];
            else
              break;
          }
        } else
          part.envelope = null;
        ++next;

        // body
        if (partLen > next && Array.isArray(cur[next]))
          part.body = exports.parseBodyStructure(cur[next], literals, prefix, 1);
        else
          part.body = null;
        ++next;
      }
      if ((part.type === 'text'
           || (part.type === 'message' && part.subtype === 'rfc822'))
          && partLen > next)
        part.lines = cur[next++];
      if (typeof cur[1] === 'string' && partLen > next)
        part.md5 = cur[next++];
    }
    // add any extra fields that may or may not be omitted entirely
    exports.parseStructExtra(part, partLen, cur, next);
    ret.unshift(part);
  }
  return ret;
};

exports.parseStructExtra = function(part, partLen, cur, next) {
  if (partLen > next) {
    // disposition
    // null or a special k/v list with these kinds of values:
    // e.g.: ['Foo', null]
    //       ['Foo', ['Bar', 'Baz']]
    //       ['Foo', ['Bar', 'Baz', 'Bam', 'Pow']]
    var disposition = { type: null, params: null };
    if (Array.isArray(cur[next])) {
      disposition.type = cur[next][0];
      if (Array.isArray(cur[next][1])) {
        disposition.params = {};
        for (var i = 0, len = cur[next][1].length, key; i < len; i += 2) {
          key = cur[next][1][i].toLowerCase();
          disposition.params[key] = cur[next][1][i + 1];
        }
      }
    } else if (cur[next] !== null)
      disposition.type = cur[next];

    if (disposition.type === null)
      part.disposition = null;
    else
      part.disposition = disposition;

    ++next;
  }
  if (partLen > next) {
    // language can be a string or a list of one or more strings, so let's
    // make this more consistent ...
    if (cur[next] !== null)
      part.language = (Array.isArray(cur[next]) ? cur[next] : [cur[next]]);
    else
      part.language = null;
    ++next;
  }
  if (partLen > next)
    part.location = cur[next++];
  if (partLen > next) {
    // extension stuff introduced by later RFCs
    // this can really be any value: a string, number, or (un)nested list
    // let's not parse it for now ...
    part.extensions = cur[next];
  }
};

exports.parseExpr = function(o, literals, result, start, useBrackets) {
  start = start || 0;
  var inQuote = false, lastPos = start - 1, isTop = false, inLitStart = false,
      val;
  if (useBrackets === undefined)
    useBrackets = true;
  if (!result)
    result = [];
  if (typeof o === 'string') {
    o = { str: o };
    isTop = true;
  }
  for (var i = start, len = o.str.length; i < len; ++i) {
    if (!inQuote) {
      if (o.str[i] === '"')
        inQuote = true;
      else if (o.str[i] === ' ' || o.str[i] === ')'
               || (useBrackets && o.str[i] === ']')) {
        if (i - (lastPos + 1) > 0) {
          val = exports.convStr(o.str.substring(lastPos + 1, i), literals);
          result.push(val);
        }
        if ((o.str[i] === ')' || (useBrackets && o.str[i] === ']')) && !isTop)
          return i;
        lastPos = i;
      } else if ((o.str[i] === '(' || (useBrackets && o.str[i] === '['))) {
        var innerResult = [];
        i = exports.parseExpr(o, literals, innerResult, i + 1, useBrackets);
        lastPos = i;
        result.push(innerResult);
      }
    } else if (o.str[i] === '"' &&
               (o.str[i - 1] &&
                (o.str[i - 1] !== '\\'
                 || (o.str[i - 2] && o.str[i - 2] === '\\')
                )))
      inQuote = false;
    if (i + 1 === len && len - (lastPos + 1) > 0)
      result.push(exports.convStr(o.str.substring(lastPos + 1), literals));
  }
  return (isTop ? result : start);
};

},{"./imap.utilities":8}],"imap":[function(require,module,exports){
module.exports=require('qIWmyf');
},{}],12:[function(require,module,exports){
require=(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],2:[function(require,module,exports){
(function(){// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

})()
},{"util":3,"buffer":4}],"buffer-browserify":[function(require,module,exports){
module.exports=require('q9TxCC');
},{}],"q9TxCC":[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.binaryWrite = SlowBuffer.prototype.asciiWrite;

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.binarySlice = SlowBuffer.prototype.asciiSlice;

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

SlowBuffer.prototype.fill = function(value, start, end) {
  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this.parent[i + this.offset] = subject.readUInt8(i);
        }
        else {
          this.parent[i + this.offset] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1];
    }
  } else {
    val = buffer.parent[buffer.offset + offset];
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer.parent[buffer.offset + offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":2,"./buffer_ieee754":1,"base64-js":5}],3:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":6}],5:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],7:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":8}],4:[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        this.parent[i + this.offset] = subject[i];
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    val |= buffer.parent[buffer.offset + offset + 1];
  } else {
    val = buffer.parent[buffer.offset + offset];
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset + 1] << 16;
    val |= buffer.parent[buffer.offset + offset + 2] << 8;
    val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    val = buffer.parent[buffer.offset + offset + 2] << 16;
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  buffer.parent[buffer.offset + offset] = value;
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
  } else {
    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset] = value & 0x00ff;
  }
}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
  } else {
    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset] = value & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":2,"./buffer_ieee754":7,"base64-js":9}],9:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}]},{},[])
;;module.exports=require("buffer-browserify")

},{}],"qIWmyf":[function(require,module,exports){
(function(process,Buffer){var assert = require('assert'),
    tls = require('tls'),
    isDate = require('util').isDate,
    inspect = require('util').inspect,
    inherits = require('util').inherits,
    Socket = require('net').Socket,
    EventEmitter = require('events').EventEmitter,
    utf7 = require('utf7').imap,
    // customized copy of XRegExp to deal with multiple variables of the same
    // name
    XRegExp = require('./xregexp').XRegExp;

var parsers = require('./imap.parsers'),
    utils = require('./imap.utilities');

// main constants
var CRLF = '\r\n',
    STATES = {
      NOCONNECT: 0,
      NOAUTH: 1,
      AUTH: 2,
      BOXSELECTING: 3,
      BOXSELECTED: 4
    },
    RE_LITHEADER = /(?:((?:BODY\[.*\](?:<\d+>)?)?|[^ ]+) )?\{(\d+)\}(?:$|\r\n)/i,
    RE_UNRESP = /^\* (OK|PREAUTH|NO|BAD)(?:\r\n|(?: \[(.+?)\])?(?: (.+))?)(?:$|\r\n)/i,
    RE_TAGGED_RESP = /^A\d+ (OK|NO|BAD) (?:\[(.+?)\] )?(.+)(?:$|\r\n)/i,
    RE_TEXT_CODE = /([^ ]+)(?: (.*))?$/,
    RE_RES_IDLE = /^IDLE /i,
    RE_RES_NOOP = /^NOOP /i,
    RE_CMD_FETCH = /^(?:UID )?FETCH/i,
    RE_PARTID = /^(?:[\d]+[\.]{0,1})*[\d]+$/,
    RE_ESCAPE = /\\\\/g,
    RE_DBLQ = /"/g,
    RE_CMD = /^([^ ]+)(?: |$)/,
    RE_ISHEADER = /HEADER/,
    REX_UNRESPDATA = XRegExp('^\\* (?:(?:(?<type>NAMESPACE) (?<personal>(?:NIL|\\((?:\\(.+\\))+\\))) (?<other>(?:NIL|\\((?:\\(.+\\))+\\))) (?<shared>(?:NIL|\\((?:\\(.+\\))+\\))))|(?:(?<type>FLAGS) \\((?<flags>.*)\\))|(?:(?<type>LIST|LSUB|XLIST) \\((?<flags>.*)\\) (?<delimiter>"[^"]+"|NIL) (?<mailbox>.+))|(?:(?<type>(SEARCH|SORT))(?: (?<results>.*))?)|(?:(?<type>STATUS) (?<mailbox>.+) \\((?<attributes>.*)\\))|(?:(?<type>CAPABILITY) (?<capabilities>.+))|(?:(?<type>BYE) (?:\\[(?<code>.+)\\] )?(?<message>.+)))[ \t]*(?:$|\r\n)', 'i'),
    REX_UNRESPNUM = XRegExp('^\\* (?<num>\\d+) (?:(?<type>EXISTS)|(?<type>RECENT)|(?<type>EXPUNGE)|(?:(?<type>FETCH) \\((?<info>.*)\\)))[ \t]*(?:$|\r\n)', 'i');

// extension constants
var IDLE_NONE = 1,
    IDLE_WAIT = 2,
    IDLE_IDLING = 3,
    IDLE_DONE = 4;

function ImapConnection(options) {
  if (!(this instanceof ImapConnection))
    return new ImapConnection(options);
  EventEmitter.call(this);

  this._options = {
    username: options.username || options.user || '',
    password: options.password || '',
    host: options.host || 'localhost',
    port: options.port || 143,
    secure: options.secure === true ? { // secure = true means default behavior
      rejectUnauthorized: false // Force pre-node-0.9.2 behavior
    } : (options.secure || false),
    connTimeout: options.connTimeout || 10000, // connection timeout in msecs
    xoauth: options.xoauth,
    xoauth2: options.xoauth2
  };

  this._state = {
    status: STATES.NOCONNECT,
    conn: null,
    curId: 0,
    requests: [],
    numCapRecvs: 0,
    isReady: false,
    isIdle: true,
    tmrKeepalive: null,
    tmoKeepalive: 10000,
    tmrConn: null,
    indata: {
      literals: [],
      line: undefined,
      line_s: { p: 0, ret: undefined },
      temp: undefined,
      streaming: false,
      expect: -1
    },
    box: {
      uidnext: 0,
      readOnly: false,
      flags: [],
      newKeywords: false,
      uidvalidity: 0,
      keywords: [],
      permFlags: [],
      name: null,
      messages: { total: 0, new: 0 },
      _newName: undefined
    },
    ext: {
      // Capability-specific state info
      idle: {
        MAX_WAIT: 300000, // 5 mins in ms
        state: IDLE_NONE,
        timeStarted: undefined
      }
    }
  };

  if (typeof options.debug === 'function')
    this.debug = options.debug;
  else
    this.debug = false;

  this.delimiter = undefined;
  this.namespaces = { personal: [], other: [], shared: [] };
  this.capabilities = [];
  this.connected = false;
  this.authenticated = false;
}

inherits(ImapConnection, EventEmitter);
module.exports = ImapConnection;
module.exports.ImapConnection = ImapConnection;

ImapConnection.prototype.connect = function(loginCb) {
  this._reset();

  var self = this,
      state = this._state,
      requests = state.requests,
      indata = state.indata;

  var socket = state.conn = new Socket(true);
  //socket.setKeepAlive(true);
  //socket.setTimeout(0);

  if (this._options.secure) {
    /*
    var tlsOptions = {};
    for (var k in this._options.secure)
      tlsOptions[k] = this._options.secure[k];
    tlsOptions.socket = state.conn;
    if (process.version.indexOf('v0.6.') > -1)
      socket = tls.connect(null, tlsOptions, onconnect);
    else
      socket = tls.connect(tlsOptions, onconnect);
  } else
    */
  }

  state.conn.once('connect', onconnect);

  socket.on('_created', function() {
    state.conn.connect(this._options.port, this._options.host);
  }.bind(this));

  function onconnect() {
    state.conn = socket; // re-assign for secure connections
    self.connected = true;
    self.authenticated = false;
    self.debug&&self.debug('[connection] Connected to host.');
    state.status = STATES.NOAUTH;
  };

  state.conn.on('end', function() {
    self.connected = false;
    self.authenticated = false;
    self.debug&&self.debug('[connection] FIN packet received. Disconnecting...');
    clearTimeout(state.tmrConn);
    self.emit('end');
  });

  state.conn.on('close', function(had_error) {
    self._reset();
    requests = state.requests;
    self.connected = false;
    self.authenticated = false;
    self.debug&&self.debug('[connection] Connection closed.');
    self.emit('close', had_error);
  });

  socket.on('error', function(err) {
    clearTimeout(state.tmrConn);
    err.level = 'socket';
    if (state.status === STATES.NOCONNECT)
      loginCb(err);
    else
      self.emit('error', err);
    self.debug&&self.debug('[connection] Error occurred: ' + err);
  });

  socket.on('ready', function() {
    var checkedNS = false;
    var reentry = function(err) {
      if (err) {
        state.conn.destroy();
        return loginCb(err);
      }
      // Next, get the list of available namespaces if supported (RFC2342)
      if (!checkedNS && self.serverSupports('NAMESPACE')) {
        // Re-enter this function after we've obtained the available
        // namespaces
        checkedNS = true;
        return self._send('NAMESPACE', reentry);
      }
      // Lastly, get the top-level mailbox hierarchy delimiter used by the
      // server
      self._send('LIST "" ""', loginCb);
    };
    setTimeout(function() {
      // First, get the supported (pre-auth or otherwise) capabilities:
      self._send('CAPABILITY', function() {
        // No need to attempt the login sequence if we're on a PREAUTH
        // connection.
        if (state.status !== STATES.AUTH) {
          // First get pre-auth capabilities, including server-supported auth
          // mechanisms
          self._login(reentry);
        } else
          reentry();
      });
    }, 5000); //HACK!
  });

  function read(b) {
    var blen = b.length, origPos = b.p;
    if (indata.expect <= (blen - b.p)) {
      var left = indata.expect;
      indata.expect = 0;
      b.p += left;
      return b.slice(origPos, origPos + left);
    } else {
      indata.expect -= (blen - b.p);
      b.p = blen;
      return origPos > 0 ? b.slice(origPos) : b;
    }
  }

  function emitLitData(key, data) {
    var fetches = requests[0].fetchers[key.replace(RE_DBLQ, '')];
    for (var i=0, len=fetches.length; i<len; ++i)
      fetches[i]._msg.emit('data', data);
  }

  function emitLitMsg(key, msg) {
    var fetches = requests[0].fetchers[key.replace(RE_DBLQ, '')];
    for (var i=0, len=fetches.length; i<len; ++i) {
      if (!fetches[i]._msg) {
        fetches[i]._msg = msg;
        fetches[i].emit('message', msg);
      }
    }
  }

  function emitMsgEnd(key) {
    var fetches = requests[0].fetchers[key.replace(RE_DBLQ, '')];
    for (var i=0, len=fetches.length; i<len; ++i) {
      if (fetches[i]._msg) {
        fetches[i]._msg.emit('end');
        fetches[i]._msg = undefined;
      }
    }
  }

  //socket.on('data', ondata);
  socket.on('data', ondata2);

  function ondata2(b) {
    TLS.process(forge.util.decode64(b.toString()));
  }

  function ondata(b) {
    b.p || (b.p = 0);
    if (b.length === 0 || b.p >= b.length) return;
    self.debug&&self.debug('\n<== ' + inspect(b.toString('binary', b.p)) + '\n');

    var r, m, litType, i, len, msg, fetches, f, lenf;
    if (indata.expect > 0) {
      r = read(b);
      if (indata.streaming) {
        emitLitData(requests[0].key, r);
        if (indata.expect === 0)
          indata.streaming = false;
      } else {
        if (indata.temp)
          indata.temp += r.toString('binary');
        else
          indata.temp = r.toString('binary');
        if (indata.expect === 0) {
          indata.literals.push(indata.temp);
          indata.temp = undefined;
        }
      }
      if (b.p >= b.length)
        return;
    }

    if ((r = utils.line(b, indata.line_s)) === false)
      return;
    else {
      m = RE_LITHEADER.exec(r);
      if (indata.line)
        indata.line += r;
      else
        indata.line = r;
      if (m)
        litType = m[1];
      indata.expect = (m ? parseInt(m[2], 10) : -1);
      if (indata.expect > -1) {
        if ((m = /\* (\d+) FETCH/i.exec(indata.line))
            && /^BODY\[/i.test(litType)) {
          msg = new ImapMessage();
          msg.seqno = parseInt(m[1], 10);
          fetches = requests[0].fetchers[litType];
          emitLitMsg(litType, msg);
          
          requests[0].key = litType;
          indata.streaming = !RE_ISHEADER.test(litType);
          if (indata.streaming)
            indata.literals.push(indata.expect);
        } else if (indata.expect === 0)
          indata.literals.push('');
        // start reading of the literal or get the rest of the response
        return ondata(b);
      }
    }

    indata.line = indata.line.trim();
    if (indata.line[0] === '*') { // Untagged server response
      var isUnsolicited = (requests[0] && requests[0].cmd === 'NOOP')
                          || (state.isIdle && state.ext.idle.state !== IDLE_NONE)
                          || !requests.length;
      if (m = XRegExp.exec(indata.line, REX_UNRESPNUM)) {
        // m.type = response type (numeric-based)
        m.type = m.type.toUpperCase();
        self.debug&&self.debug('[parsing incoming] saw untagged ' + m.type);
        switch (m.type) {
          case 'FETCH':
            // m.info = message details
            var data, parsed, headers, f, lenf, body, lenb, msg, bodies,
                details, val;

            isUnsolicited = isUnsolicited
                            || (requests[0]
                                && !RE_CMD_FETCH.test(requests[0].cmdstr));

            if (!isUnsolicited)
              bodies = parsers.parseFetchBodies(m.info, indata.literals);

            details = new ImapMessage();
            parsers.parseFetch(m.info, indata.literals, details);
            details.seqno = parseInt(m.num, 10);

            if (details['x-gm-labels'] !== undefined) {
              var labels = details['x-gm-labels'];
              for (var i=0, len=labels.length; i<len; ++i)
                labels[i] = labels[i].replace(RE_ESCAPE, '\\');
            }

            if (isUnsolicited)
              self.emit('msgupdate', details);
            else {
              if (requests[0].fetchers[''] !== undefined) {
                // account for non-body fetches
                if (bodies) {
                  bodies.push('');
                  bodies.push(null);
                } else
                  bodies = ['', null];
              }

              var shouldEmit;
              for (body = 0, lenb = bodies.length; body < lenb; body += 2) {
                fetches = requests[0].fetchers[bodies[body]];
                val = bodies[body + 1];
                for (var i=0, len=fetches.length; i<len; ++i) {
                  parsed = undefined;
                  if (shouldEmit = (!fetches[i]._msg))
                    fetches[i]._msg = new ImapMessage();

                  // copy message properties (uid, date, flags, etc)
                  for (var k = 0, keys = Object.keys(details), lenk = keys.length;
                       k < lenk; ++k)
                    fetches[i]._msg[keys[k]] = details[keys[k]];

                  if (shouldEmit)
                    fetches[i].emit('message', fetches[i]._msg);

                  if (typeof val === 'number') {
                    // we streamed a body, e.g. {3}\r\nfoo
                  } else {
                    // no body was streamed
                    if (typeof val === 'string') {
                      // a body was given as a quoted, non-literal string,
                      // e.g. "foo"
                      if (RE_ISHEADER.test(bodies[body])) {
                        var parsed, data, headers;
                        if (fetches[i]._parse) {
                          if (parsed === undefined)
                            parsed = parsers.parseHeaders(val);
                          headers = parsed;
                        } else {
                          if (data === undefined)
                            data = new Buffer(val, 'binary');
                          headers = data;
                        }
                        fetches[i]._msg.emit('headers', headers);
                      } else {
                        var data = new Buffer(val, 'binary');
                        fetches[i]._msg.emit('data', data);
                      }
                    }
                  }
                }
              }
              for (body = 0, lenb = bodies.length; body < lenb; body += 2)
                emitMsgEnd(bodies[body]);
            }
            break;
          case 'EXISTS':
            // mailbox total message count
            var prev = state.box.messages.total,
                now = parseInt(m.num, 10);
            state.box.messages.total = now;
            if (state.status !== STATES.BOXSELECTING && now > prev) {
              state.box.messages.new = now - prev;
              self.emit('mail', state.box.messages.new); // new mail
            }
            break;
          case 'RECENT':
            // messages marked with the \Recent flag (i.e. new messages)
            state.box.messages.new = parseInt(m.num, 10);
            break;
          case 'EXPUNGE':
            // confirms permanent deletion of a single message
            if (state.box.messages.total > 0)
              --state.box.messages.total;
            if (isUnsolicited)
              self.emit('deleted', parseInt(m.num, 10));
            break;
        }
      } else if (m = XRegExp.exec(indata.line, REX_UNRESPDATA)) {
        // m.type = response type (data)
        m.type = m.type.toUpperCase();
        self.debug&&self.debug('[parsing incoming] saw untagged ' + m.type);
        switch (m.type) {
          case 'NAMESPACE':
            // m.personal = personal namespaces (or null)
            // m.other = personal namespaces (or null)
            // m.shared = personal namespaces (or null)
            self.namespaces.personal =
                  parsers.parseNamespaces(m.personal, indata.literals);
            self.namespaces.other =
                  parsers.parseNamespaces(m.other, indata.literals);
            self.namespaces.shared =
                  parsers.parseNamespaces(m.shared, indata.literals);
            break;
          case 'FLAGS':
            // m.flags = list of 0+ flags
            m.flags = (m.flags
                       ? m.flags.split(' ')
                                .map(function(f) {
                                  return f.substr(1);
                                })
                       : []);
            if (state.status === STATES.BOXSELECTING)
              state.box.flags = m.flags;
            break;
          case 'LIST':
          case 'LSUB':
          case 'XLIST':
            // m.flags = list of 0+ flags
            // m.delimiter = mailbox delimiter (string or null)
            // m.mailbox = mailbox name (string)
            m.flags = (m.flags ? m.flags.toUpperCase().split(' ') : []);
            m.delimiter = parsers.convStr(m.delimiter, indata.literals);
            m.mailbox = utf7.decode(''+parsers.convStr(m.mailbox, indata.literals));
            if (self.delimiter === undefined)
              self.delimiter = parsers.convStr(m.delimiter, indata.literals);
            else {
              if (requests[0].cbargs.length === 0)
                requests[0].cbargs.push({});
              var box = {
                    attribs: m.flags.map(function(attr) {
                               return attr.substr(1);
                             }),
                    delimiter: m.delimiter,
                    children: null,
                    parent: null
                  },
                  name = m.mailbox,
                  curChildren = requests[0].cbargs[0];

              if (box.delimiter) {
                var path = name.split(box.delimiter),
                    parent = null;
                name = path.pop();
                for (i=0,len=path.length; i<len; i++) {
                  if (!curChildren[path[i]])
                    curChildren[path[i]] = {};
                  if (!curChildren[path[i]].children)
                    curChildren[path[i]].children = {};
                  parent = curChildren[path[i]];
                  curChildren = curChildren[path[i]].children;
                }
                box.parent = parent;
              }
              if (curChildren[name])
                box.children = curChildren[name].children;
              curChildren[name] = box;
            }
            break;
          case 'SEARCH':
          case 'SORT':
            // m.results = list of 0+ uid/seq numbers (undefined if none)
            requests[0].cbargs.push(m.results
                                    ? m.results.trim().split(' ')
                                    : []);
            break;
          case 'STATUS':
            // m.mailbox = mailbox name (string)
            // m.attributes = expression list (k=>v pairs) of mailbox attributes
            m.mailbox = utf7.decode(''+parsers.convStr(m.mailbox, indata.literals));
            var ret = {
              name: m.mailbox,
              uidvalidity: 0,
              messages: {
                total: 0,
                new: 0,
                unseen: undefined
              }
            };
            if (m.attributes) {
              m.attributes = parsers.parseExpr(m.attributes, indata.literals);
              for (i=0,len=m.attributes.length; i<len; ++i) {
                switch (m.attributes[i].toUpperCase()) {
                  case 'RECENT':
                    ret.messages.new = parseInt(m.attributes[++i], 10);
                  break;
                  case 'UNSEEN':
                    ret.messages.unseen = parseInt(m.attributes[++i], 10);
                  break;
                  case 'MESSAGES':
                    ret.messages.total = parseInt(m.attributes[++i], 10);
                  break;
                  case 'UIDVALIDITY':
                    ret.uidvalidity = parseInt(m.attributes[++i], 10);
                  break;
                }
              }
            }
            requests[0].cbargs.push(ret);
            break;
          case 'CAPABILITY':
            // m.capabilities = list of (1+) flags
            if (state.numCapRecvs < 2)
              ++state.numCapRecvs;
            self.capabilities = m.capabilities.toUpperCase().split(' ');
            break;
          case 'BYE':
            // m.code = resp-text-code
            // m.message = arbitrary message
            state.conn.end();
            break;
        }
      } else if (m = RE_UNRESP.exec(indata.line)) {
        // m[1]: response type
        // m[2]: resp-text-code
        // m[3]: message
        m[1] = m[1].toUpperCase();
        self.debug&&self.debug('[parsing incoming] saw untagged ' + m[1]);
        switch (m[1]) {
          case 'OK':
            if (m[2] === undefined && m[3] === undefined)
              break;
            var code, codeval;
            if (m[2]) {
              code = RE_TEXT_CODE.exec(m[2]);
              codeval = code[2];
              code = code[1].toUpperCase();
            }
            if (state.status === STATES.NOAUTH) {
              if (!state.isReady) {
                clearTimeout(state.tmrConn);
                state.isReady = true;
                state.conn.emit('ready');
              }
            } else if (code === 'ALERT')
              self.emit('alert', m[3]);
            else if (state.status === STATES.BOXSELECTING) {
              if (code === 'UIDVALIDITY')
                state.box.uidvalidity = parseInt(codeval, 10);
              else if (code === 'UIDNEXT')
                state.box.uidnext = parseInt(codeval, 10);
              else if (code === 'PERMANENTFLAGS') {
                var idx, permFlags, keywords;
                codeval = codeval.substr(1, codeval.length - 2);
                state.box.permFlags = permFlags = codeval.split(' ');
                if ((idx = state.box.permFlags.indexOf('\\*')) > -1) {
                  state.box.newKeywords = true;
                  permFlags.splice(idx, 1);
                }
                state.box.keywords = keywords = permFlags.filter(function(f) {
                                                  return (f[0] !== '\\');
                                                });
                for (i=0,len=keywords.length; i<len; ++i)
                  permFlags.splice(permFlags.indexOf(keywords[i]), 1);
                state.box.permFlags = permFlags.map(function(f) {
                                        return f.substr(1);
                                      });
              }
            } else if (state.status === STATES.BOXSELECTED) {
              if (code === 'UIDVALIDITY') {
                state.box.uidvalidity = parseInt(codeval, 10);
                self.emit('uidvalidity', state.box.uidvalidity);
              }
            }
            break;
          case 'PREAUTH':
            state.status = STATES.AUTH;
            self.authenticated = true;
            if (state.numCapRecvs === 0)
              state.numCapRecvs = 1;
            break;
          case 'NO':
          case 'BAD':
            if (state.status === STATES.NOAUTH) {
              clearTimeout(state.tmrConn);
              var err = new Error('Received negative welcome (' + m[3] + ')');
              err.level = 'protocol';
              if (state.status === STATES.NOCONNECT)
                loginCb(err);
              else
                self.emit('error', err);
              state.conn.end();
            }
            break;
        }
      } else {
        self.debug&&self.debug(
            '[parsing incoming] saw unexpected untagged response: '
            + inspect(indata.line));
        assert(false);
      }
      indata.literals = [];
      indata.line = undefined;
      indata.temp = undefined;
      indata.streaming = false;
      indata.expect = -1;
      if (b.p < b.length)
        return ondata(b);
    } else if (indata.line[0] === 'A' || indata.line[0] === '+') {
      var line = indata.line;
      indata.literals = [];
      indata.line = undefined;
      indata.temp = undefined;
      indata.streaming = false;
      indata.expect = -1;

      self.debug&&self.debug(line[0] === 'A'
                             ? '[parsing incoming] saw tagged response'
                             : '[parsing incoming] saw continuation response');

      clearTimeout(state.tmrKeepalive);

      if (line[0] === '+' && state.ext.idle.state === IDLE_WAIT) {
        state.ext.idle.state = IDLE_IDLING;
        state.ext.idle.timeStarted = Date.now();
        doKeepaliveTimer();
        return process.nextTick(function() { self._send(); });
      }

      var sendBox = false;
      if (state.status === STATES.BOXSELECTING) {
        if (/^A\d+ OK/i.test(line)) {
          sendBox = true;
          state.box.readOnly = (requests[0].cmd === 'EXAMINE');
          state.status = STATES.BOXSELECTED;
        } else {
          state.status = STATES.AUTH;
          self._resetBox();
        }
      }
      if (requests[0].cmd === 'RENAME') {
        if (state.box._newName) {
          state.box.name = state.box._newName;
          state.box._newName = undefined;
        }
        sendBox = true;
      }

      if (typeof requests[0].callback === 'function') {
        m = RE_TAGGED_RESP.exec(line);
        var err = null;
        var args = requests[0].cbargs,
            cmdstr = requests[0].cmdstr;
        if (!m) {
          if (requests[0].cmd === 'APPEND')
            return requests[0].callback();
          else {
            var isXOAuth2 = (cmdstr.indexOf('AUTHENTICATE XOAUTH2') === 0),
                msg = (isXOAuth2
                       ? new Buffer(line.substr(2), 'base64').toString('utf8')
                       : 'Unexpected continuation');
            err = new Error(msg);
            err.level = 'protocol';
            err.type = (isXOAuth2 ? 'failure' : 'continuation');
            err.request = cmdstr;
          }
        } else if (m[1] !== 'OK') {
          // m[1]: error type
          // m[2]: resp-text-code
          // m[3]: message
          err = new Error(m[3]);
          err.level = 'protocol';
          err.type = 'failure';
          err.code = m[2];
          err.request = cmdstr;
        } else if (state.status === STATES.BOXSELECTED) {
          if (sendBox) // SELECT, EXAMINE, RENAME
            args.unshift(state.box);
          // According to RFC 3501, UID commands do not give errors for
          // non-existant user-supplied UIDs, so give the callback empty results
          // if we unexpectedly received no untagged responses.
          else if ((cmdstr.indexOf('UID FETCH') === 0
                    || cmdstr.indexOf('UID SEARCH') === 0
                    || cmdstr.indexOf('UID SORT') === 0
                   ) && args.length === 0)
            args.unshift([]);
        }
        if (m) {
          var msg = m[3], info;
          if (m[2]) {
            m = RE_TEXT_CODE.exec(m[2]);
            info = {
              code: m[1].toUpperCase(),
              codeval: m[2],
              message: msg
            };
          } else
            info = { message: msg };
          args.push(info);
        }
        args.unshift(err);
        requests[0].callback.apply(self, args);
      }

      var recentCmd = requests[0].cmd;
      requests.shift();

      if (!requests.length && recentCmd !== 'LOGOUT')
        doKeepalive();
      else
        process.nextTick(function() { self._send(); });

      state.isIdle = true;
    } else if (RE_RES_IDLE.test(indata.line)) {
      self.debug&&self.debug('[parsing incoming] saw IDLE');
      requests.shift(); // remove IDLE request
      var idx;
      if ((idx = indata.line.indexOf(CRLF)) > -1)
        indata.line = indata.line.substr(idx + 2);
      else
        indata.line = undefined;
      state.ext.idle.state = IDLE_NONE;
      state.ext.idle.timeStarted = undefined;
      if (requests.length) {
        state.isIdle = false;
        self._send();
      } else
        doKeepalive();
    } else if (RE_RES_NOOP.test(indata.line)) {
      self.debug&&self.debug('[parsing incoming] saw NOOP');
      requests.shift(); // remove NOOP request
      var idx;
      if ((idx = indata.line.indexOf(CRLF)) > -1)
        indata.line = indata.line.substr(idx + 2);
      else
        indata.line = undefined;
      if (!requests.length)
        doKeepaliveTimer();
      else
        self._send();
    } else {
      // unknown response
      self.debug&&self.debug('[parsing incoming] saw unexpected response: '
                             + inspect(indata.line));
      assert(false);
    }
  }

  function doKeepalive() {
    if (state.status >= STATES.AUTH) {
      if (self.serverSupports('IDLE'))
        self._send('IDLE');
      else
        self._noop();
    }
  }

  function doKeepaliveTimer() {
    state.tmrKeepalive = setTimeout(function idleHandler() {
      if (state.isIdle) {
        if (state.ext.idle.state === IDLE_IDLING) {
          var timeDiff = Date.now() - state.ext.idle.timeStarted;
          if (timeDiff >= state.ext.idle.MAX_WAIT) {
            state.ext.idle.state = IDLE_DONE;
            self._send('DONE');
          } else
            state.tmrKeepalive = setTimeout(idleHandler, state.tmoKeepalive);
        } else if (!self.serverSupports('IDLE'))
          doKeepalive();
      }
    }, state.tmoKeepalive);
  }


  state.tmrConn = setTimeout(function() {
    state.conn.destroy();
    state.conn = undefined;
    var err = new Error('Connection timed out');
    err.level = 'timeout';
    loginCb(err);
  }, this._options.connTimeout);
};

ImapConnection.prototype.logout = function(cb) {
  var self = this;
  if (this._state.status >= STATES.NOAUTH) {
    this._send('LOGOUT', function(err) {
      self._state.conn.end();
      if (typeof cb === 'function')
        cb(err);
    });
    if (cb === true)
      this._state.conn.removeAllListeners();
  } else
    throw new Error('Not connected');
};

ImapConnection.prototype.openBox = function(name, readOnly, cb) {
  if (this._state.status < STATES.AUTH)
    throw new Error('Not connected or authenticated');
  if (this._state.status === STATES.BOXSELECTED)
    this._resetBox();
  if (cb === undefined) {
    cb = readOnly;
    readOnly = false;
  }

  name = ''+name;
  this._state.box.name = name;

  this._send((readOnly ? 'EXAMINE' : 'SELECT') + ' "'
             + utils.escape(utf7.encode(name)) + '"', cb);
};

// also deletes any messages in this box marked with \Deleted
ImapConnection.prototype.closeBox = function(cb) {
  var self = this;
  if (this._state.status !== STATES.BOXSELECTED)
    throw new Error('No mailbox is currently selected');
  this._send('CLOSE', function(err) {
    if (!err) {
      self._state.status = STATES.AUTH;
      self._resetBox();
    }
    cb(err);
  });
};

ImapConnection.prototype.status = function(boxName, cb) {
  if (this._state.status === STATES.BOXSELECTED
      && this._state.box.name === boxName)
    throw new Error('Not allowed to call status on the currently selected mailbox');

  var cmd = 'STATUS "';
  cmd += utils.escape(utf7.encode(''+boxName));
  cmd += '" (MESSAGES RECENT UNSEEN UIDVALIDITY)';

  this._send(cmd, cb);
};

ImapConnection.prototype.removeDeleted = function(cb) {
  this._send('EXPUNGE', cb);
};

ImapConnection.prototype.getBoxes = function(namespace, cb) {
  if (typeof namespace === 'function') {
    cb = namespace;
    namespace = '';
  }
  this._send((!this.serverSupports('XLIST') ? 'LIST' : 'XLIST')
             + ' "' + utils.escape(utf7.encode(''+namespace)) + '" "*"', cb);
};

ImapConnection.prototype.addBox = function(name, cb) {
  this._send('CREATE "' + utils.escape(utf7.encode(''+name)) + '"', cb);
};

ImapConnection.prototype.delBox = function(name, cb) {
  this._send('DELETE "' + utils.escape(utf7.encode(''+name)) + '"', cb);
};

ImapConnection.prototype.renameBox = function(oldname, newname, cb) {
  if (this._state.status === STATES.BOXSELECTED
      && oldname === this._state.box.name && oldname !== 'INBOX')
    this._state.box._newName = ''+oldname;

  var cmd = 'RENAME "';
  cmd += utils.escape(utf7.encode(''+oldname));
  cmd += '" "';
  cmd += utils.escape(utf7.encode(''+newname));
  cmd += '"';
  this._send(cmd, cb);
};

ImapConnection.prototype.append = function(data, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  if (!options.mailbox) {
    if (this._state.status !== STATES.BOXSELECTED)
      throw new Error('No mailbox specified or currently selected');
    else
      options.mailbox = this._state.box.name;
  }
  var cmd = 'APPEND "' + utils.escape(utf7.encode(''+options.mailbox)) + '"';
  if (options.flags) {
    if (!Array.isArray(options.flags))
      options.flags = [options.flags];
    if (options.flags.length > 0)
      cmd += " (\\" + options.flags.join(' \\') + ")";
  }
  if (options.date) {
    if (!isDate(options.date))
      throw new Error("`date` isn't a Date object");
    cmd += ' "';
    cmd += options.date.getDate();
    cmd += '-';
    cmd += utils.MONTHS[options.date.getMonth()];
    cmd += '-';
    cmd += options.date.getFullYear();
    cmd += ' ';
    cmd += ('0' + options.date.getHours()).slice(-2);
    cmd += ':';
    cmd += ('0' + options.date.getMinutes()).slice(-2);
    cmd += ':';
    cmd += ('0' + options.date.getSeconds()).slice(-2);
    cmd += ((options.date.getTimezoneOffset() > 0) ? ' -' : ' +' );
    cmd += ('0' + (-options.date.getTimezoneOffset() / 60)).slice(-2);
    cmd += ('0' + (-options.date.getTimezoneOffset() % 60)).slice(-2);
    cmd += '"';
  }
  cmd += ' {';
  cmd += (Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data));
  cmd += '}';
  var self = this, step = 1;
  this._send(cmd, function(err, info) {
    if (err || step++ === 2)
      return cb(err, info);
    self._state.conn.write(data);
    self._state.conn.write(CRLF);
    self.debug&&self.debug('\n==> ' + inspect(data.toString()) + '\n');
  });
};

ImapConnection.prototype.search = function(options, cb) {
  this._search('UID ', options, cb);
};

ImapConnection.prototype._search = function(which, options, cb) {
  if (this._state.status !== STATES.BOXSELECTED)
    throw new Error('No mailbox is currently selected');
  if (!Array.isArray(options))
    throw new Error('Expected array for search options');
  this._send(which + 'SEARCH'
             + utils.buildSearchQuery(options, this.capabilities), cb);
};

ImapConnection.prototype.sort = function(sorts, options, cb) {
  this._sort('UID ', sorts, options, cb);
};

ImapConnection.prototype._sort = function(which, sorts, options, cb) {
  if (this._state.status !== STATES.BOXSELECTED)
    throw new Error('No mailbox is currently selected');
  if (!Array.isArray(sorts) || !sorts.length)
    throw new Error('Expected array with at least one sort criteria');
  if (!Array.isArray(options))
    throw new Error('Expected array for search options');
  if (!this.serverSupports('SORT'))
    return cb(new Error('Sorting is not supported on the server'));

  var criteria = sorts.map(function(criterion) {
    if (typeof criterion !== 'string')
      throw new Error('Unexpected sort criterion data type. '
                      + 'Expected string. Got: ' + typeof criteria);

    var modifier = '';
    if (criterion[0] === '-') {
      modifier = 'REVERSE ';
      criterion = criterion.substring(1);
    }
    switch (criterion.toUpperCase()) {
      case 'ARRIVAL':
      case 'CC':
      case 'DATE':
      case 'FROM':
      case 'SIZE':
      case 'SUBJECT':
      case 'TO':
        break;
      default:
        throw new Error('Unexpected sort criteria: ' + criterion);
    }

    return modifier + criterion;
  });

  this._send(which + 'SORT (' + criteria.join(' ') + ') UTF-8'
             + utils.buildSearchQuery(options, this.capabilities), cb);
};

ImapConnection.prototype.fetch = function(uids, options, what, cb) {
  return this._fetch('UID ', uids, options, what, cb);
};

ImapConnection.prototype._fetch = function(which, uids, options, what, cb) {
  if (uids === undefined
      || uids === null
      || (Array.isArray(uids) && uids.length === 0))
    throw new Error('Nothing to fetch');

  if (!Array.isArray(uids))
    uids = [uids];
  utils.validateUIDList(uids);

  var toFetch = '', prefix = ' BODY[', extensions, self = this,
      parse, headers, key, stream,
      fetchers = {};

  // argument detection!
  if (cb === undefined) {
    // fetch(uids, xxxx, yyyy)
    if (what === undefined) {
      // fetch(uids, xxxx)
      if (options === undefined) {
        // fetch(uids)
        what = options = {};
      } else if (typeof options === 'function') {
        // fetch(uids, callback)
        cb = options;
        what = options = {};
      } else if (options.struct !== undefined
               || options.size !== undefined
               || options.markSeen !== undefined) {
        // fetch(uids, options)
        what = {};
      } else {
        // fetch(uids, what)
        what = options;
        options = {};
      }
    } else if (typeof what === 'function') {
      // fetch(uids, xxxx, callback)
      cb = what;
      if (options.struct !== undefined
          || options.size !== undefined
          || options.markSeen !== undefined) {
        // fetch(uids, options, callback)
        what = {};
      } else {
        // fetch(uids, what, callback)
        what = options;
        options = {};
      }
    }
  }

  if (!Array.isArray(what))
    what = [what];

  for (var i = 0, wp, pprefix, len = what.length; i < len; ++i) {
    wp = what[i];
    parse = true;
    if (wp.id !== undefined && !RE_PARTID.test(''+wp.id))
      throw new Error('Invalid part id: ' + wp.id);
    if (( (typeof wp.headers === 'object'
           && (!wp.headers.fields
               || (Array.isArray(wp.headers.fields)
                   && wp.headers.fields.length === 0)
              )
           && wp.headers.parse === false
          )
          ||
          (typeof wp.headersNot === 'object'
           && (!wp.headersNot.fields
               || (Array.isArray(wp.headersNot.fields)
                   && wp.headersNot.fields.length === 0)
              )
           && wp.headersNot.parse === false
          )
        )
        && wp.body === true) {
      key = prefix.trim();
      if (wp.id !== undefined)
        key += wp.id;
      key += ']';
      if (!fetchers[key]) {
        fetchers[key] = [new ImapFetch()];
        toFetch += ' ';
        toFetch += key;
      }
      if (typeof wp.cb === 'function')
        wp.cb(fetchers[key][0]);
      key = undefined;
    } else if (wp.headers || wp.headersNot || wp.body) {
      pprefix = prefix;
      if (wp.id !== undefined) {
        pprefix += wp.id;
        pprefix += '.';
      }
      if (wp.headers) {
        key = pprefix.trim();
        if (wp.headers === true)
          key += 'HEADER]';
        else {
          if (Array.isArray(wp.headers))
            headers = wp.headers;
          else if (typeof wp.headers === 'string')
            headers = [wp.headers];
          else if (typeof wp.headers === 'object') {
            if (wp.headers.fields === undefined)
              wp.headers.fields = true;
            if (!Array.isArray(wp.headers.fields)
                && typeof wp.headers.fields !== 'string'
                && wp.headers.fields !== true)
              throw new Error('Invalid `fields` property');
            if (Array.isArray(wp.headers.fields))
              headers = wp.headers.fields;
            else if (wp.headers.fields === true)
              headers = true;
            else
              headers = [wp.headers.fields];
            if (wp.headers.parse === false)
              parse = false;
          } else
            throw new Error('Invalid `headers` value: ' + wp.headers);
          if (headers === true)
            key += 'HEADER]';
          else {
            key += 'HEADER.FIELDS (';
            key += headers.join(' ').toUpperCase();
            key += ')]';
          }
        }
      } else if (wp.headersNot) {
        key = pprefix.trim();
        if (wp.headersNot === true)
          key += 'HEADER]';
        else {
          if (Array.isArray(wp.headersNot))
            headers = wp.headersNot;
          else if (typeof wp.headersNot === 'string')
            headers = [wp.headersNot];
          else if (typeof wp.headersNot === 'object') {
            if (wp.headersNot.fields === undefined)
              wp.headersNot.fields = true;
            if (!Array.isArray(wp.headersNot.fields)
                && typeof wp.headersNot.fields !== 'string'
                && wp.headersNot.fields !== true)
              throw new Error('Invalid `fields` property');
            if (Array.isArray(wp.headersNot.fields))
              headers = wp.headersNot.fields;
            else if (wp.headersNot.fields)
              headers = true;
            else
              headers = [wp.headersNot.fields];
            if (wp.headersNot.parse === false)
              parse = false;
          } else
            throw new Error('Invalid `headersNot` value: ' + wp.headersNot);
          if (headers === true)
            key += 'HEADER]';
          else {
            key += 'HEADER.FIELDS.NOT (';
            key += headers.join(' ').toUpperCase();
            key += ')]';
          }
        }
      }
      if (key) {
        stream = new ImapFetch();
        if (parse)
          stream._parse = true;
        if (!fetchers[key]) {
          fetchers[key] = [stream];
          toFetch += ' ';
          toFetch += key;
        } else
          fetchers[key].push(stream);
        if (typeof wp.cb === 'function')
          wp.cb(stream);
        key = undefined;
      }
      if (wp.body) {
        key = pprefix;
        if (wp.body === true)
          key += 'TEXT]';
        else
          throw new Error('Invalid `body` value: ' + wp.body);

        key = key.trim();
        if (!stream)
          stream = new ImapFetch();
        if (!fetchers[key]) {
          fetchers[key] = [stream];
          toFetch += ' ' + key;
        } else
          fetchers[key].push(stream);
        if (!wp.headers && !wp.headersNot && typeof wp.cb === 'function')
          wp.cb(stream);
        stream = undefined;
        key = undefined;
      }
    } else {
      // non-body fetches
      stream = new ImapFetch();
      if (fetchers[''])
        fetchers[''].push(stream);
      else
        fetchers[''] = [stream];
      if (typeof wp.cb === 'function')
        wp.cb(stream);
    }
  }

  // always fetch GMail-specific bits of information when on GMail
  if (this.serverSupports('X-GM-EXT-1'))
    extensions = 'X-GM-THRID X-GM-MSGID X-GM-LABELS ';

  var cmd = which;
  cmd += 'FETCH ';
  cmd += uids.join(',');
  cmd += ' (';
  if (extensions)
    cmd += extensions;
  cmd += 'UID FLAGS INTERNALDATE';
  if (options.struct)
    cmd += ' BODYSTRUCTURE';
  if (options.size)
    cmd += ' RFC822.SIZE';
  if (toFetch) {
    if (!options.markSeen)
      cmd += toFetch.replace(/BODY\[/g, 'BODY.PEEK[');
    else
      cmd += toFetch;
  }
  cmd += ')';

  this._send(cmd, function(err) {
    var keys = Object.keys(fetchers), k, lenk = keys.length, f, lenf,
        fetches;
    if (err) {
      for (k = 0; k < lenk; ++k) {
        fetches = fetchers[keys[k]];
        for (f = 0, lenf = fetches.length; f < lenf; ++f)
          fetches[f].emit('error', err);
      }
    }
    for (k = 0; k < lenk; ++k) {
      fetches = fetchers[keys[k]];
      for (f = 0, lenf = fetches.length; f < lenf; ++f)
        fetches[f].emit('end');
    }
    cb&&cb(err);
  });

  this._state.requests[this._state.requests.length - 1].fetchers = fetchers;
};

ImapConnection.prototype.addFlags = function(uids, flags, cb) {
  this._store('UID ', uids, flags, true, cb);
};

ImapConnection.prototype.delFlags = function(uids, flags, cb) {
  this._store('UID ', uids, flags, false, cb);
};

ImapConnection.prototype.addKeywords = function(uids, flags, cb) {
  return this._addKeywords('UID ', uids, flags, cb);
};

ImapConnection.prototype._addKeywords = function(which, uids, flags, cb) {
  if (!this._state.box.newKeywords)
    throw new Error('This mailbox does not allow new keywords to be added');
  this._store(which, uids, flags, true, cb);
};

ImapConnection.prototype.delKeywords = function(uids, flags, cb) {
  this._store('UID ', uids, flags, false, cb);
};

ImapConnection.prototype.setLabels = function(uids, labels, cb) {
    this._storeLabels('UID ', uids, labels, '', cb);
};

ImapConnection.prototype.addLabels = function(uids, labels, cb) {
    this._storeLabels('UID ', uids, labels, '+', cb);
};

ImapConnection.prototype.delLabels = function(uids, labels, cb) {
    this._storeLabels('UID ', uids, labels, '-', cb);
};

ImapConnection.prototype._storeLabels = function(which, uids, labels, mode, cb) {
  if (!this.serverSupports('X-GM-EXT-1'))
      throw new Error('Server must support X-GM-EXT-1 capability');
  if (this._state.status !== STATES.BOXSELECTED)
      throw new Error('No mailbox is currently selected');
  if (uids === undefined)
      throw new Error('The message ID(s) must be specified');

  if (!Array.isArray(uids))
      uids = [uids];
  utils.validateUIDList(uids);

  if ((!Array.isArray(labels) && typeof labels !== 'string')
      || (Array.isArray(labels) && labels.length === 0))
      throw new Error('labels argument must be a string or a non-empty Array');
  if (!Array.isArray(labels))
      labels = [labels];
  labels = labels.join(' ');

  this._send(which + 'STORE ' + uids.join(',') + ' ' + mode
             + 'X-GM-LABELS.SILENT (' + labels + ')', cb);
};

ImapConnection.prototype.copy = function(uids, boxTo, cb) {
  return this._copy('UID ', uids, boxTo, cb);
};

ImapConnection.prototype._copy = function(which, uids, boxTo, cb) {
  if (this._state.status !== STATES.BOXSELECTED)
    throw new Error('No mailbox is currently selected');

  if (!Array.isArray(uids))
    uids = [uids];

  utils.validateUIDList(uids);

  this._send(which + 'COPY ' + uids.join(',') + ' "'
             + utils.escape(utf7.encode(''+boxTo)) + '"', cb);
};

ImapConnection.prototype.move = function(uids, boxTo, cb) {
  return this._move('UID ', uids, boxTo, cb);
};

ImapConnection.prototype._move = function(which, uids, boxTo, cb) {
  var self = this;
  if (this._state.status !== STATES.BOXSELECTED)
    throw new Error('No mailbox is currently selected');
  if (this._state.box.permFlags.indexOf('Deleted') === -1) {
    throw new Error('Cannot move message: '
                    + 'server does not allow deletion of messages');
  } else {
    this._copy(which, uids, boxTo,
      function ccb(err, info, reentryCount, deletedUIDs, counter) {
        if (err)
          return cb(err, info);

        counter = counter || 0;
        // Make sure we don't expunge any messages marked as Deleted except the
        // one we are moving
        if (reentryCount === undefined) {
          self.search(['DELETED'], function(e, result) {
            ccb(e, info, 1, result);
          });
        } else if (reentryCount === 1) {
          if (counter < deletedUIDs.length) {
            self.delFlags(deletedUIDs[counter], 'Deleted', function(e) {
              process.nextTick(function() {
                ccb(e, info, reentryCount, deletedUIDs, counter + 1);
              });
            });
          } else
            ccb(err, info, reentryCount + 1, deletedUIDs);
        } else if (reentryCount === 2) {
          self.addFlags(uids, 'Deleted', function(e) {
            ccb(e, info, reentryCount + 1, deletedUIDs);
          });
        } else if (reentryCount === 3) {
          self.removeDeleted(function(e) {
            ccb(e, info, reentryCount + 1, deletedUIDs);
          });
        } else if (reentryCount === 4) {
          if (counter < deletedUIDs.length) {
            self.addFlags(deletedUIDs[counter], 'Deleted', function(e) {
              process.nextTick(function() {
                ccb(e, info, reentryCount, deletedUIDs, counter + 1);
              });
            });
          } else
            cb(err, info);
        }
      }
    );
  }
};

// Namespace for seqno-based commands
ImapConnection.prototype.__defineGetter__('seq', function() {
  var self = this;
  return {
    move: function(seqnos, boxTo, cb) {
      return self._move('', seqnos, boxTo, cb);
    },
    copy: function(seqnos, boxTo, cb) {
      return self._copy('', seqnos, boxTo, cb);
    },
    delKeywords: function(seqnos, flags, cb) {
      self._store('', seqnos, flags, false, cb);
    },
    addKeywords: function(seqnos, flags, cb) {
      return self._addKeywords('', seqnos, flags, cb);
    },
    delFlags: function(seqnos, flags, cb) {
      self._store('', seqnos, flags, false, cb);
    },
    addFlags: function(seqnos, flags, cb) {
      self._store('', seqnos, flags, true, cb);
    },
    delLabels: function(seqnos, labels, cb) {
      self._storeLabels('', seqnos, labels, '-', cb);
    },
    addLabels: function(seqnos, labels, cb) {
      self._storeLabels('', seqnos, labels, '+', cb);
    },
    setLabels: function(seqnos, labels, cb) {
      self._storeLabels('', seqnos, labels, '', cb);
    },
    fetch: function(seqnos, options, what, cb) {
      return self._fetch('', seqnos, options, what, cb);
    },
    search: function(options, cb) {
      self._search('', options, cb);
    },
    sort: function(sorts, options, cb) {
      self._sort('', sorts, options, cb);
    }
  };
});


// Private/Internal Functions
ImapConnection.prototype.serverSupports = function(capability) {
  return (this.capabilities.indexOf(capability) > -1);
};

ImapConnection.prototype._store = function(which, uids, flags, isAdding, cb) {
  var isKeywords = (arguments.callee.caller === this._addKeywords
                    || arguments.callee.caller === this.delKeywords);
  if (this._state.status !== STATES.BOXSELECTED)
    throw new Error('No mailbox is currently selected');
  if (uids === undefined)
    throw new Error('The message ID(s) must be specified');

  if (!Array.isArray(uids))
    uids = [uids];
  utils.validateUIDList(uids);

  if ((!Array.isArray(flags) && typeof flags !== 'string')
      || (Array.isArray(flags) && flags.length === 0))
    throw new Error((isKeywords ? 'Keywords' : 'Flags')
                    + ' argument must be a string or a non-empty Array');
  if (!Array.isArray(flags))
    flags = [flags];
  for (var i=0; i<flags.length; i++) {
    if (!isKeywords) {
      if (flags[i][0] === '\\')
        flags[i] = flags[i].substr(1);
      if (this._state.box.permFlags.indexOf(flags[i]) === -1
          || flags[i] === '*')
        throw new Error('The flag "' + flags[i]
                        + '" is not allowed by the server for this mailbox');
      flags[i] = '\\' + flags[i];
    } else {
      // keyword contains any char except control characters (%x00-1F and %x7F)
      // and: '(', ')', '{', ' ', '%', '*', '\', '"', ']'
      if (/[\(\)\{\\\"\]\%\*\x00-\x20\x7F]/.test(flags[i])) {
        throw new Error('The keyword "' + flags[i]
                        + '" contains invalid characters');
      }
    }
  }
  flags = flags.join(' ');

  this._send(which + 'STORE ' + uids.join(',') + ' ' + (isAdding ? '+' : '-')
             + 'FLAGS.SILENT (' + flags + ')', cb);
};

ImapConnection.prototype._login = function(cb) {
  var self = this,
      fnReturn = function(err) {
        if (!err) {
          self._state.status = STATES.AUTH;
          self.authenticated = true;
          if (self._state.numCapRecvs !== 2) {
            // fetch post-auth server capabilities if they were not
            // automatically provided after login
            self._send('CAPABILITY', cb);
            return;
          }
        }
        cb(err);
      };

  if (this._state.status === STATES.NOAUTH) {
    if (this.serverSupports('LOGINDISABLED'))
      return cb(new Error('Logging in is disabled on this server'));

    if (this.serverSupports('AUTH=XOAUTH') && this._options.xoauth) {
      this._send('AUTHENTICATE XOAUTH ' + utils.escape(this._options.xoauth),
                 fnReturn);
    } else if (this.serverSupports('AUTH=XOAUTH2') && this._options.xoauth2) {
      this._send('AUTHENTICATE XOAUTH2 ' + utils.escape(this._options.xoauth2),
                 fnReturn);
    } else if (this._options.username && this._options.password) {
      this._send('LOGIN "' + utils.escape(this._options.username) + '" "'
                 + utils.escape(this._options.password) + '"', fnReturn);
    } else {
      return cb(new Error('No supported authentication method(s) available. '
                          + 'Unable to login.'));
    }
  }
};

ImapConnection.prototype._reset = function() {
  clearTimeout(this._state.tmrKeepalive);
  clearTimeout(this._state.tmrConn);
  this._state.status = STATES.NOCONNECT;
  this._state.curId = 0;
  this._state.requests = [];
  this._state.numCapRecvs = 0;
  this._state.isReady = false;
  this._state.isIdle = true;
  this._state.tmrKeepalive = null;
  this._state.tmrConn = null;
  this._state.ext.idle.state = IDLE_NONE;
  this._state.ext.idle.timeStarted = undefined;

  this._state.indata.literals = [];
  this._state.indata.line = undefined;
  this._state.indata.line_s.p = 0;
  this._state.indata.line_s.ret = undefined;
  this._state.indata.temp = undefined;
  this._state.indata.streaming = false;
  this._state.indata.expect = -1;

  this.namespaces = { personal: [], other: [], shared: [] };
  this.delimiter = undefined;
  this.capabilities = [];

  this._resetBox();
};

ImapConnection.prototype._resetBox = function() {
  this._state.box.uidnext = 0;
  this._state.box.readOnly = false;
  this._state.box.flags = [];
  this._state.box.newKeywords = false;
  this._state.box.uidvalidity = 0;
  this._state.box.permFlags = [];
  this._state.box.keywords = [];
  this._state.box.name = undefined;
  this._state.box._newName = undefined;
  this._state.box.messages.total = 0;
  this._state.box.messages.new = 0;
};

ImapConnection.prototype._noop = function() {
  if (this._state.status >= STATES.AUTH)
    this._send('NOOP');
};

ImapConnection.prototype._send = function(cmdstr, cb) {
  //if (!this._state.conn.writable)
  //  return;

  var reqs = this._state.requests, idle = this._state.ext.idle;

  if (cmdstr !== undefined) {
    var info = {
      cmd: cmdstr.match(RE_CMD)[1],
      cmdstr: cmdstr,
      callback: cb,
      cbargs: []
    };
    if (cmdstr === 'IDLE' || cmdstr === 'DONE' || cmdstr === 'NOOP')
      reqs.unshift(info);
    else
      reqs.push(info);
  }

  if (idle.state !== IDLE_NONE && cmdstr !== 'DONE') {
    if ((cmdstr !== undefined || reqs.length > 1)
        && idle.state === IDLE_IDLING) {
      idle.state = IDLE_DONE;
      this._send('DONE');
    }
    return;
  }

  if ((cmdstr === undefined && reqs.length) || reqs.length === 1
      || cmdstr === 'DONE') {
    var prefix = '', curReq = reqs[0];

    cmdstr = curReq.cmdstr;

    clearTimeout(this._state.tmrKeepalive);

    if (cmdstr === 'IDLE') {
      // we use a different prefix to differentiate and disregard the tagged
      // response the server will send us when we issue DONE
      prefix = 'IDLE ';
      this._state.ext.idle.state = IDLE_WAIT;
    } else if (cmdstr === 'NOOP')
      prefix = 'NOOP ';
    else if (cmdstr !== 'DONE')
      prefix = 'A' + (++this._state.curId) + ' ';

    this._state.conn.write(prefix + cmdstr + CRLF);
    this.debug&&this.debug('\n==> ' + prefix + cmdstr + '\n');

    if (curReq.cmd === 'EXAMINE' || curReq.cmd === 'SELECT')
      this._state.status = STATES.BOXSELECTING;
    else if (cmdstr === 'DONE')
      reqs.shift();
  }
};

function ImapMessage() {
  this.seqno = undefined;
  this.uid = undefined;
  this.flags = undefined;
  this.date = undefined;
  this.structure = undefined;
  this.size = undefined;
}
inherits(ImapMessage, EventEmitter);

function ImapFetch() {
  this._parse = false;
}
inherits(ImapFetch, EventEmitter);

})(require("__browserify_process"),require("__browserify_buffer").Buffer)
},{"assert":"P++JCd","tls":6,"util":"+c0iQh","net":"8b6xEy","events":1,"./xregexp":7,"./imap.parsers":11,"./imap.utilities":8,"utf7":13,"__browserify_process":5,"__browserify_buffer":12}],10:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],13:[function(require,module,exports){
(function(){var Buffer = require('buffer').Buffer;

function encode(str) {
    var b = new Buffer(str.length * 2, 'ascii');
    for (var i = 0, bi = 0; i < str.length; i++) {
        // Note that we can't simply convert a UTF-8 string to Base64 because
        // UTF-8 uses a different encoding. In modified UTF-7, all characters
        // are represented by their two byte Unicode ID.
        var c = str.charCodeAt(i);
        // Upper 8 bits shifted into lower 8 bits so that they fit into 1 byte.
        b[bi++] = c >> 8;
        // Lower 8 bits. Cut off the upper 8 bits so that they fit into 1 byte.
        b[bi++] = c & 0xFF;
    }
    // Modified Base64 uses , instead of / and omits trailing =.
    return b.toString('base64').replace(/=+$/, '');
}

function decode(str) {
    var b = new Buffer(str, 'base64');
    var r = [];
    for (var i = 0; i < b.length;) {
        // Calculate charcode from two adjacent bytes.
        r.push(String.fromCharCode(b[i++] << 8 | b[i++]));
    }
    return r.join('');
}

// Escape RegEx from http://simonwillison.net/2006/Jan/20/escape/
function escape(chars) {
    return chars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Character classes defined by RFC 2152.
var setD = "A-Za-z0-9" + escape("'(),-./:?");
var setO = escape("!\"#$%&*;<=>@[]^_'{|}");
var setW = escape(" \r\n\t");

// Stores compiled regexes for various replacement pattern.
var regexes = {};
var regexAll = new RegExp("[^" + setW + setD + setO + "]+", 'g');

exports.imap = {};

// RFC 2152 UTF-7 encoding.
exports.encode = function(str, mask) {
    // Generate a RegExp object from the string of mask characters.
    if (!mask) {
        mask = '';
    }
    if (!regexes[mask]) {
        regexes[mask] = new RegExp("[^" + setD + escape(mask) + "]+", 'g');
    }

    // We replace subsequent disallowed chars with their escape sequence.
    return str.replace(regexes[mask], function(chunk) {
        // + is represented by an empty sequence +-, otherwise call encode().
        return '+' + (chunk === '+' ? '' : encode(chunk)) + '-';
    });
};

// RFC 2152 UTF-7 encoding with all optionals.
exports.encodeAll = function(str) {
    // We replace subsequent disallowed chars with their escape sequence.
    return str.replace(regexAll, function(chunk) {
        // + is represented by an empty sequence +-, otherwise call encode().
        return '+' + (chunk === '+' ? '' : encode(chunk)) + '-';
    });
};

// RFC 3501, section 5.1.3 UTF-7 encoding.
exports.imap.encode = function(str) {
    // All printable ASCII chars except for & must be represented by themselves.
    // We replace subsequent non-representable chars with their escape sequence.
    return str.replace(/&/g, '&-').replace(/[^\x20-\x7e]+/g, function(chunk) {
        // & is represented by an empty sequence &-, otherwise call encode().
        chunk = (chunk === '&' ? '' : encode(chunk)).replace(/\//g, ',');
        return '&' + chunk + '-';
    });
};

// RFC 2152 UTF-7 decoding.
exports.decode = function(str) {
    return str.replace(/\+([A-Za-z0-9\/]*)-?/gi, function(_, chunk) {
        // &- represents &.
        if (chunk === '') return '+';
        return decode(chunk);
    });
};

// RFC 3501, section 5.1.3 UTF-7 decoding.
exports.imap.decode = function(str) {
    return str.replace(/&([^-]*)-/g, function(_, chunk) {
        // &- represents &.
        if (chunk === '') return '&';
        return decode(chunk.replace(/,/g, '/'));
    });
};

})()
},{"buffer":2}]},{},[3])
;
