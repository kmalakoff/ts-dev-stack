"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return unlinkCmd;
    }
});
var _tsdslib = require("tsds-lib");
function unlinkCmd(_args, options, cb) {
    try {
        (0, _tsdslib.unlink)((0, _tsdslib.installPath)(options), cb);
    } catch (err) {
        return cb(err);
    }
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }