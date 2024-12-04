"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return format;
    }
});
var _tsdslib = require("tsds-lib");
function format(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    (0, _tsdslib.spawn)('npm', [
        'run',
        'format'
    ], {
        cwd: cwd
    }, cb);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }