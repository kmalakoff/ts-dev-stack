"use strict";
var spawn = require('tsds-lib').spawn;
module.exports = function format(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    spawn('npm', [
        'run',
        'format'
    ], {
        cwd: cwd
    }, cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }