"use strict";
var path = require('path');
module.exports = function installPath(options) {
    options = options || {};
    if (options.installPath) return options.installPath;
    var cwd = options.cwd || process.cwd();
    var pkg = require(path.resolve(cwd, 'package.json'));
    return path.resolve(cwd, 'node_modules', pkg.name);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }