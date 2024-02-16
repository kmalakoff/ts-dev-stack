"use strict";
var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
var assign = require("just-extend");
var Queue = require("queue-cb");
var spawn = require("../lib/spawn");
var source = require("../lib/source");
module.exports = function umd(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = path.resolve(cwd, source(options));
    options = assign({}, options);
    options.type = "umd";
    options.sourceMaps = true;
    options.dest = path.join(cwd, "dist", "umd");
    rimraf(options.dest, function() {
        var queue = new Queue(1);
        queue.defer(spawn.bind(null, "rollup", [
            "--config",
            path.resolve(__dirname, "..", "..", "esm", "rollup-swc", "index.mjs"),
            "--input",
            src
        ], {
            cwd: cwd
        }));
        queue.defer(fs.writeFile.bind(null, path.join(options.dest, "package.json"), '{"type":"commonjs"}'));
        queue.await(cb);
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}