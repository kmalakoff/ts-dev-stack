"use strict";
module.exports = function uuid() {
    return "".concat(new Date().getTime(), "-").concat(Math.floor(Math.random() * 100000));
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }