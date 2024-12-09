"use strict";
module.exports = function packageVersion(name) {
    try {
        var pkg = require("".concat(name, "/package.json"));
        return pkg.version;
    } catch (_err) {
        return '';
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }