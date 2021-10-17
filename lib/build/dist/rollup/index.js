/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var spawn = require("../../../lib/spawn");

module.exports = function build(_args, cb) {
  var args = ["--config", path.resolve(__dirname, "rollup-umd.cjs")];
  spawn("rollup", args, { env: { BABEL_ENV: "umd" } }, cb);
};
