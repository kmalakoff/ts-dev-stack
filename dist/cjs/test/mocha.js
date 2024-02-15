"use strict";
var Queue = require("queue-cb");
var spawnArgs = require("ts-swc-loaders").spawnArgs;
var link = require("../link");
var spawn = require("../lib/spawn");
var major = +process.versions.node.split(".")[0];
var type = major >= 12 ? "module" : "commonjs";
module.exports = function mocha(args, options, cb) {
    link(args, options, function(_err, restore) {
        var queue = new Queue(1);
        queue.defer(function(cb) {
            var tests = args && args.length ? args[0] : "test/**/*.test.*";
            var mochaOptions = options.timeout ? [
                "--timeout",
                options.timeout
            ] : [];
            var mocha = major >= 12 ? "mocha" : "mocha-compat";
            var cmd = require.resolve("".concat(mocha, "/bin/_").concat(mocha));
            var argsSpawn = spawnArgs(type, cmd, mochaOptions.concat([
                "--watch-extensions",
                "ts,tsx",
                tests
            ]), {});
            spawn(argsSpawn[0], argsSpawn[1], argsSpawn[2], cb);
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
};
module.exports.options = {
    alias: {
        temp: "t"
    }
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}