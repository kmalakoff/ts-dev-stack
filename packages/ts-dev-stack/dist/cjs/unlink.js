"use strict";
var _require = require('tsds-lib'), unlink = _require.unlink, installPath = _require.installPath;
module.exports = function unlinkCmd(_args, options, cb) {
    try {
        unlink(installPath(options), cb);
    } catch (err) {
        return cb(err);
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }