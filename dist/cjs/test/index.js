"use strict";
var Queue = require("queue-cb");
var mocha = require("./mocha");
var karma = require("./karma");
var c8 = require("./c8");
module.exports = function test(args, options, cb) {
    var queue = new Queue(1);
    queue.defer(mocha.bind(null, args, options));
    queue.defer(karma.bind(null, args, options));
    queue.defer(c8.bind(null, args, options));
    queue.await(cb);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}