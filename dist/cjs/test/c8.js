"use strict";
var path = require("path");
var rimraf = require("rimraf");
var Queue = require("queue-cb");
// const { spawnArgs } = require('ts-swc-loaders');
var link = require("../link");
var spawn = require("../lib/spawn");
// const major = +process.versions.node.split('.')[0];
// const type = major >= 12 ? 'module' : 'commonjs';
module.exports = function c8(_args, options, cb) {
    link(_args, options, function(err, restore) {
        if (err) return cb(err);
        var queue = new Queue(1);
        queue.defer(function(cb) {
            rimraf(path.resolve(process.cwd(), "coverage"), function() {
                cb();
            });
        });
        queue.defer(function(cb) {
            // TODO: get spawn working for c8
            var cmd = path.resolve("./node_modules/.bin/c8");
            var args = [
                "--no-warnings=ExperimentalWarning",
                cmd,
                "--config",
                path.join(__dirname, "..", "..", "..", "assets", "c8rc.json"),
                "mocha",
                "--watch-extensions",
                "ts,tsx"
            ];
            args = args.concat(_args.length ? _args.slice(-1) : [
                "test/**/*.test.*"
            ]);
            spawn("node", args, {
                env: {
                    NODE_OPTIONS: "--no-warnings=ExperimentalWarning --loader ts-swc-loaders"
                }
            }, cb);
        // const argsSpawn = spawnArgs(type, cmd, args, {});
        // spawn(argsSpawn[0], argsSpawn[1], argsSpawn[2], cb);
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