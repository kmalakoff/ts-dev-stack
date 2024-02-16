"use strict";
module.exports = [
    ".js",
    ".jsx",
    ".es6",
    ".es",
    ".cjs",
    ".mjs",
    ".ts",
    ".tsx",
    ".json"
];

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}