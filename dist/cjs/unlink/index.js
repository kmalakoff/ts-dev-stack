"use strict";
var path = require('path');
var unlink = require('./unlink');
module.exports = function linkCmd(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    try {
        var pkg = require(path.resolve(cwd, 'package.json'));
        var installPath = options.installPath || path.resolve(cwd, 'node_modules', pkg.name);
        unlink(installPath, cb);
    } catch (err) {
        return cb(err);
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { if(typeof exports.default === 'object') Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { if (key !== 'default') exports.default[key] = exports[key]; }; module.exports = exports.default; }