"use strict";
module.exports = function uuid() {
    return "".concat(new Date().getTime(), "-").concat(Math.floor(Math.random() * 100000));
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }