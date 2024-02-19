"use strict";
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
var fs = require("fs");
var path = require("path");
var rimraf = require("rimraf");
var Queue = require("queue-cb");
var compileDirectory = require("./compileDirectory");
module.exports = function cjs(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    options = _object_spread({}, options);
    options.type = "cjs";
    options.sourceMaps = true;
    options.dest = path.join(cwd, "dist", "cjs");
    rimraf(options.dest, function() {
        var queue = new Queue(1);
        queue.defer(compileDirectory.bind(null, options));
        queue.defer(fs.writeFile.bind(null, path.join(options.dest, "package.json"), '{"type":"commonjs"}'));
        queue.await(cb);
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }