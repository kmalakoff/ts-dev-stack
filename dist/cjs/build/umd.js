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
var fs = require('fs');
var path = require('path');
var Queue = require('queue-cb');
var rimraf2 = require('rimraf2');
var spawn = require('../lib/spawn');
var source = require('../lib/source');
module.exports = function umd(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = path.resolve(cwd, source(options));
    options = _object_spread({}, options);
    options.type = 'umd';
    options.sourceMaps = true;
    options.dest = path.join(cwd, 'dist', 'umd');
    rimraf2(options.dest, {
        disableGlob: true
    }, function() {
        var queue = new Queue(1);
        queue.defer(spawn.bind(null, 'rollup', [
            '--config',
            path.resolve(__dirname, '..', '..', 'esm', 'rollup-swc', 'index.mjs'),
            '--input',
            src
        ], {
            cwd: cwd
        }));
        queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
        queue.await(cb);
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }