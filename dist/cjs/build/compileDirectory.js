"use strict";
var path = require("path");
var Iterator = require("fs-iterator");
var assign = require("just-extend");
var getTS = require("get-tsconfig-compat");
var createMatcher = require("ts-swc-loaders").createMatcher;
var source = require("../lib/source");
var compileFile = require("./compileFile");
module.exports = function compileDirectory(options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = source(options);
    var srcFolder = path.dirname(path.resolve(cwd, src));
    var config = getTS.getTsconfig(path.resolve(cwd, "tsconfig.json"));
    var matcher = createMatcher(config);
    options = assign({}, options, {
        config: config
    });
    var iterator = new Iterator(srcFolder);
    iterator.forEach(function(entry, callback) {
        if (!entry.stats.isFile()) return callback();
        if (!matcher(entry.fullPath)) return callback();
        compileFile(entry, options, callback);
    }, {
        callbacks: true,
        concurrency: 1024
    }, cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }