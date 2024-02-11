"use strict";
var path = require("path");
module.exports = function targets(options) {
    var pkg = require(path.resolve(options.cwd || process.cwd(), "package.json"));
    if (pkg.tsds && pkg.tsds.targets) return pkg.tsds.targets;
    return [
        "cjs",
        "esm",
        "umd"
    ];
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}