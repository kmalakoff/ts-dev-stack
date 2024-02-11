"use strict";
var path = require("path");
var link = require("./lib/link");
module.exports = function linkCmd(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    try {
        var pkg = require(path.resolve(cwd, "package.json"));
        var installPath = path.resolve(cwd, "node_modules", pkg.name);
        link(installPath, cb);
    } catch (err) {
        return cb(err);
    }
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}