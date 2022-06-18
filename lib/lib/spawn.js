/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var crossSpawn = require("cross-spawn-cb");
var assign = require("just-extend");
var prepend = require("path-string-prepend");
var envPathKey = require("env-path-key");

var PATH_KEY = envPathKey();

module.exports = function spawn(cmd, args, options, cb) {
  var env = assign({}, process.env, options.env || {});
  env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(__dirname, "..", "..", "node_modules", ".bin"));
  env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(process.cwd(), "node_modules", ".bin"));
  crossSpawn(cmd, args, { stdio: "inherit", cwd: process.cwd(), env: env }, cb);
};
