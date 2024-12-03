"use strict";
var _require = require('tsds-lib'), link = _require.link, installPath = _require.installPath;
module.exports = function linkCmd(_args, options, cb) {
    try {
        link(installPath(options), cb);
    } catch (err) {
        return cb(err);
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }