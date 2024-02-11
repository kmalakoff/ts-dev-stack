"use strict";
var path = require("path");
var Queue = require("queue-cb");
var link = require("../link");
var spawn = require("../lib/spawn");
module.exports = function karma(args, options, cb) {
    link(args, options, function(_err, restore) {
        var queue = new Queue(1);
        queue.defer(function(cb) {
            var tests = args.length ? args[0] : "test/**/*.test.*";
            spawn("karma", [
                "start",
                path.join(__dirname, "..", "..", "..", "assets", "karma.conf.js"),
                tests
            ], {}, cb);
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}