"use strict";
var Queue = require("queue-cb");
var spawnParams = require("ts-swc-loaders").spawnParams;
var link = require("../link");
var spawn = require("../lib/spawn");
var major = +process.versions.node.split(".")[0];
var type = major < 12 ? "commonjs" : "module";
module.exports = function mocha(_args, options, cb) {
    link(_args, options, function(_err, restore) {
        var queue = new Queue(1);
        queue.defer(function(cb) {
            var cwd = options.cwd || process.cwd();
            var mocha = major < 12 ? "mocha-compat" : "mocha";
            var cmd = require.resolve("".concat(mocha, "/bin/_").concat(mocha));
            var args = [
                "--watch-extensions",
                "ts,tsx"
            ];
            for(var key in options){
                if (key === "_") continue;
                if (options[key] === true) args.push("--".concat(key));
                else if (options[key] === false) args.push("--no-".concat(key));
                else args = args.concat([
                    "--".concat(key),
                    options[key]
                ]);
            }
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
module.exports.options = {
    alias: {
        temp: "t"
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }