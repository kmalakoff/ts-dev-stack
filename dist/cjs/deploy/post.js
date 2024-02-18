"use strict";
var spawn = require("../lib/spawn");
module.exports = function post(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    spawn("gh-pages", [
        "-d",
        "docs"
    ], {
        cwd: cwd
    }, cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }