"use strict";
var path = require("path");
var crossSpawn = require("cross-spawn-cb");
var pathKey = require("env-path-key");
var assign = require("just-extend");
var prepend = require("path-string-prepend");
module.exports = function spawn(cmd, args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var PATH_KEY = pathKey(options);
    var env = assign({}, process.env, options.env || {});
    env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(__dirname, "..", "..", "node_modules", ".bin"));
    env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(cwd, "node_modules", ".bin"));
    crossSpawn(cmd, args, {
        stdio: "inherit",
        cwd: cwd,
        env: env
    }, cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }