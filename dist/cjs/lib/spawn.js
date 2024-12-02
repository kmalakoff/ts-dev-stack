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
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var path = require('path');
var crossSpawn = require('cross-spawn-cb');
var pathKey = require('env-path-key');
var prepend = require('path-string-prepend');
module.exports = function spawn(cmd, args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var PATH_KEY = pathKey(options);
    var env = _object_spread_props(_object_spread({}, process.env), {
        env: options.env || {}
    });
    env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(__dirname, '..', '..', '..', '..', '..', 'node_modules', '.bin'));
    env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(cwd, 'node_modules', '.bin'));
    crossSpawn(cmd, args, {
        stdio: 'inherit',
        cwd: cwd,
        env: env
    }, cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { if(typeof exports.default === 'object') Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { if (key !== 'default') exports.default[key] = exports[key]; }; module.exports = exports.default; }