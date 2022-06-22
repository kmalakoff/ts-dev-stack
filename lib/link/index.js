/* eslint-disable @typescript-eslint/no-var-requires */
var link = require("../lib/link");

module.exports = function linkCmd(args, options, cb) {
  link(cb);
};
