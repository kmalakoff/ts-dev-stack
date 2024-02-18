"use strict";
var path = require("path");
module.exports = function targets(options) {
    var pkg = require(path.resolve(options.cwd || process.cwd(), "package.json"));
    if (pkg.tsds && pkg.tsds.targets) return pkg.tsds.targets;
    return [
        "cjs",
        "esm",
        "umd"
    ];
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }