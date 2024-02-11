"use strict";
var path = require("path");
var crossSpawn = require("cross-spawn-cb");
var pathKey = require("env-path-key");
var assign = require("just-extend");
var prepend = require("path-string-prepend");
module.exports = function spawn(cmd, args, options, cb) {
    var PATH_KEY = pathKey(options);
    var env = assign({}, process.env, options.env || {});
    env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(__dirname, "..", "..", "node_modules", ".bin"));
    env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(process.cwd(), "node_modules", ".bin"));
    crossSpawn(cmd, args, {
        stdio: "inherit",
        cwd: process.cwd(),
        env: env
    }, cb);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}