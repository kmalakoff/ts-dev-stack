"use strict";
module.exports = function uuid() {
    return "".concat(new Date().getTime(), "-").concat(Math.floor(Math.random() * 100000));
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}