"use strict";
var spawn = require('../lib/spawn');
module.exports = function format(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    spawn('npm', [
        'run',
        'format'
    ], {
        cwd: cwd
    }, cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { if(typeof exports.default === 'object') Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { if (key !== 'default') exports.default[key] = exports[key]; }; module.exports = exports.default; }