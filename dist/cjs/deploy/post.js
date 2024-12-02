"use strict";
var spawn = require('../lib/spawn');
module.exports = function post(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    spawn('gh-pages', [
        '-d',
        'docs'
    ], {
        cwd: cwd
    }, cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; }; module.exports = exports.default; } catch (_) {} }