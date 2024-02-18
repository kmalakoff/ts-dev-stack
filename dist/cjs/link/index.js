"use strict";
var path = require("path");
var link = require("./link");
module.exports = function linkCmd(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    try {
        var pkg = require(path.resolve(cwd, "package.json"));
        var installPath = options.installPath || path.resolve(cwd, "node_modules", pkg.name);
        link(installPath, cb);
    } catch (err) {
        return cb(err);
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }