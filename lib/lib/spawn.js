/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var crossSpawn = require("cross-spawn-cb");
var assign = require("just-extend");
var prepend = require("path-string-prepend");

function windowsPathKey() {
  var pathKey = "Path";

  for (var key in process.env) {
    if (key.toUpperCase() === "PATH") {
      pathKey = key;
      if (pathKey !== "PATH") return key; // 'which' in cross-spawn uses PATH in windows, but this causes issues in repeat spawn calls given PATH get propagated so PATH_KEY needs to select 'Path' over 'PATH' if both exist
    }
  }
  return pathKey;
}
var PATH_KEY = process.platform === "win32" ? windowsPathKey() : "PATH";

module.exports = function spawn(cmd, args, options, cb) {
  var env = assign({}, process.env, options.env || {});
  env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(__dirname, "..", "..", "node_modules", ".bin"));
  env[PATH_KEY] = prepend(env[PATH_KEY] || "", path.resolve(process.cwd(), "node_modules", ".bin"));
  crossSpawn(cmd, args, { stdio: "inherit", cwd: process.cwd(), env: env }, cb);
};
