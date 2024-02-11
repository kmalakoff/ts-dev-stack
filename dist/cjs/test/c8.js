"use strict";
var path = require("path");
var rimraf = require("rimraf");
var Queue = require("queue-cb");
var link = require("../link");
var spawn = require("../lib/spawn");
module.exports = function c8(_args, _options, cb) {
    link(_args, _options, function(err, restore) {
        if (err) return cb(err);
        var queue = new Queue(1);
        queue.defer(function(cb) {
            rimraf(path.resolve(process.cwd(), "coverage"), function() {
                cb();
            });
        });
        queue.defer(function(cb) {
            var args = [
                "--config",
                path.join(__dirname, "..", "..", "..", "assets", "c8rc.json")
            ];
            args.push("mocha");
            args = args.concat(_args.length ? _args.slice(-1) : [
                "test/unit/*.test.*"
            ]);
            spawn("c8", args, {
                env: {
                    NODE_OPTIONS: "--loader ts-swc-loaders"
                }
            }, cb);
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