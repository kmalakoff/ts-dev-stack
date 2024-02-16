"use strict";
var Queue = require("queue-cb");
var spawn = require("../lib/spawn");
var docs = require("../docs");
module.exports = function version(_args, _options, cb) {
    var queue = new Queue(1);
    queue.defer(docs.bind(null, _args, _options));
    queue.defer(spawn.bind(null, "git", [
        "add",
        "docs"
    ], {}));
    queue.await(cb);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}