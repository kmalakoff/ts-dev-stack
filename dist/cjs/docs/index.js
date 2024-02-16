"use strict";
var path = require("path");
var fs = require("fs");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var Queue = require("queue-cb");
var spawn = require("../lib/spawn");
var source = require("../lib/source");
module.exports = function docs(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = source(options);
    var dest = path.resolve(cwd, "docs");
    var tsConfigDocsPath = path.join(cwd, "tsconfig.docs.json");
    rimraf(dest, function() {
        var queue = new Queue(1);
        queue.defer(mkdirp.bind(null, dest));
        queue.defer(function(cb) {
            var tsConfig = require(path.join(cwd, "tsconfig.json"));
            tsConfig.include = (tsConfig.include || []).filter(function(x) {
                return x.indexOf("test") !== 0;
            });
            fs.writeFile(tsConfigDocsPath, JSON.stringify(tsConfig), "utf8", cb);
        });
        queue.defer(spawn.bind(null, "typedoc", [
            "--tsconfig",
            tsConfigDocsPath,
            "--includeVersion",
            src
        ], {
            cwd: cwd
        }));
        queue.defer(fs.unlink.bind(null, tsConfigDocsPath));
        queue.await(cb);
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}