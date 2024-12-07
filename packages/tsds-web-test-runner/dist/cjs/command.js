"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return command;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _sync = /*#__PURE__*/ _interop_require_default(require("resolve/sync"));
var _tsdslib = require("tsds-lib");
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
function packageRoot(dir, packageName) {
    if (_path.default.basename(dir) === packageName) return dir;
    var nextDir = _path.default.dirname(dir);
    if (nextDir === dir) throw new Error(''.concat(packageName, ' not found'));
    return packageRoot(nextDir, packageName);
}
var major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
var nvu = (0, _tsdslib.binPath)((0, _sync.default)('node-version-use/package.json', {
    basedir: __dirname
}), 'nvu');
var config = _path.default.resolve(packageRoot(__dirname, 'tsds-web-test-runner'), 'assets', 'web-test-runner.config.cjs');
var wtr = (0, _tsdslib.binPath)((0, _sync.default)('@web/test-runner/package.json', {
    basedir: __dirname
}), 'web-test-runner');
function command(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    options = _object_spread({}, options);
    options.cwd = undefined;
    (0, _tsdslib.link)((0, _tsdslib.installPath)(options), function(_err, restore) {
        var queue = new _queuecb.default(1);
        queue.defer(function(cb) {
            var args = [
                wtr
            ];
            if (major < 14) args = [
                nvu,
                'stable'
            ].concat(args);
            args = args.concat((0, _tsdslib.optionsToArgs)(options));
            if (!options.config) args = args.concat((0, _tsdslib.optionsToArgs)({
                config: config
            }));
            args = args.concat(_args.length ? _args.slice(-1) : [
                'test/**/*.test.{ts,tsx,jsx,mjs}'
            ]);
            (0, _tsdslib.spawn)(args[0], args.slice(1), {
                cwd: cwd
            }, cb);
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }