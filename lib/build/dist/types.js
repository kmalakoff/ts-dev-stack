/* eslint-disable @typescript-eslint/no-var-requires */
var spawn = require("../../lib/spawn");

module.exports = function build(_options, cb) {
  var args = ["--declaration", "--emitDeclarationOnly", "--outDir", "dist/types"];
  spawn("tsc", args, {}, cb);
};
