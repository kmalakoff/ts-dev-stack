var spawn = require("../../lib/spawn");
var extensions = require("../../lib/extensions");

module.exports = function babel(options, cb) {
  var args = [
    options.src || "src",
    "--extensions",
    "'" + extensions.join(",") + "'",
    "--out-dir",
    options.dist || "dist/" + options.format,
    "--source-maps",
  ];
  if (options.format === 'esm') args = args.concat(["--out-file-extension", ".mjs"])
  spawn("babel", args, { env: { BABEL_ENV: options.format } }, cb);
};
