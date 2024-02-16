"use strict";
var path = require("path");
var fs = require("fs");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var Queue = require("queue-cb");
var assign = require("just-extend");
var spawn = require("../lib/spawn");
var source = require("../lib/source");
module.exports = function docs(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = source(options);
    var dest = path.resolve(process.cwd(), "docs");
    rimraf(dest, function() {
        var queue = new Queue(1);
        queue.defer(mkdirp.bind(null, dest));
        queue.defer(spawn.bind(null, "typedoc", [
            src
        ], {
            cwd: cwd
        }));
        queue.await(cb);
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}