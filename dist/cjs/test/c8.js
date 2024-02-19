"use strict";
var path = require("path");
var rimraf = require("rimraf");
var Queue = require("queue-cb");
var spawnParams = require("ts-swc-loaders").spawnParams;
var link = require("../link");
var spawn = require("../lib/spawn");
var major = +process.versions.node.split(".")[0];
var type = major < 12 ? "commonjs" : "module";
module.exports = function c8(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    link(_args, options, function(err, restore) {
        if (err) return cb(err);
        var queue = new Queue(1);
        queue.defer(function(cb) {
            rimraf(path.resolve(process.cwd(), "coverage"), function() {
                cb();
            });
        });
        queue.defer(function(cb) {
            var cmd = require.resolve("c8/bin/c8");
            var args = [
                "--config",
                path.join(__dirname, "..", "..", "..", "assets", "c8rc.json"),
                "mocha",
                "--watch-extensions",
                "ts,tsx"
            ];
            args = args.concat(_args.length ? _args.slice(-1) : [
                "test/**/*.test.*"
            ]);
            var params = spawnParams(type, {
                cwd: cwd
            });
            if (params.options.NODE_OPTIONS || params.args[0] === "--require") {
                spawn(cmd, params.args.concat(args), params.options, cb);
            } else {
                spawn("node", params.args.concat([
                    cmd
                ]).concat(args), params.options, cb);
            }
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }