"use strict";
var Queue = require("queue-cb");
var spawnArgs = require("ts-swc-loaders").spawnArgs;
var link = require("../link");
var spawn = require("../lib/spawn");
var major = +process.versions.node.split(".")[0];
var type = major >= 12 ? "module" : "commonjs";
module.exports = function mocha(_args, options, cb) {
    link(_args, options, function(_err, restore) {
        var queue = new Queue(1);
        queue.defer(function(cb) {
            var mocha = major >= 12 ? "mocha" : "mocha-compat";
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
            var spawnParams = spawnArgs(type, {});
            if (spawnParams.options.NODE_OPTIONS || spawnParams.args[0] === "--require") {
                spawn(cmd, spawnParams.args.concat(args), spawnParams.options, cb);
            } else {
                spawn("node", spawnParams.args.concat([
                    cmd
                ]).concat(args), spawnParams.options, cb);
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
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }