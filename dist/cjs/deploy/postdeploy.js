"use strict";
var spawn = require("../lib/spawn");
module.exports = function post(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    spawn("gh-pages", [
        "-d",
        "docs"
    ], {
        cwd: cwd
    }, cb);
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}