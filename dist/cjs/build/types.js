"use strict";
var path = require("path");
var rimraf = require("rimraf");
var Iterator = require("fs-iterator");
var getTS = require("get-tsconfig-compat");
var createMatcher = require("ts-swc-loaders").createMatcher;
var spawn = require("../lib/spawn");
var source = require("../lib/source");
module.exports = function types(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = source(options);
    var srcFolder = path.dirname(path.resolve(cwd, src));
    var dest = path.join(cwd, "dist", "types");
    var config = getTS.getTsconfig(path.resolve(cwd, "tsconfig.json"));
    var matcher = createMatcher(config);
    var tsArgs = [];
    for(var key in config.config.compilerOptions){
        var value = config.config.compilerOptions[key];
        tsArgs.push("--".concat(key));
        tsArgs.push(Array.isArray(value) ? value.join(",") : value);
    }
    rimraf(dest, function() {
        var files = [];
        var iterator = new Iterator(srcFolder);
        iterator.forEach(function(entry, callback) {
            if (!entry.stats.isFile()) return callback();
            if (!matcher(entry.fullPath)) return callback();
            files.push(entry.fullPath);
            callback();
        }, {
            callbacks: true,
            concurrency: 1024
        }, function(err) {
            if (err) return cb(err);
            var args = files.concat([
                "--declaration",
                "--emitDeclarationOnly",
                "--outDir",
                dest
            ]).concat(tsArgs);
            spawn("tsc", args, {
                cwd: cwd
            }, cb);
        });
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}