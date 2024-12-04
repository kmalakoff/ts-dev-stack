"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return umd;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
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
function root(dir) {
    if (_path.default.basename(dir) === 'ts-dev-stack') return dir;
    var nextDir = _path.default.dirname(dir);
    if (nextDir === dir) throw new Error('ts-dev-stack not found');
    return root(nextDir);
}
function umd(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = _path.default.resolve(cwd, (0, _tsdslib.source)(options));
    options = _object_spread({}, options);
    options.type = 'umd';
    options.sourceMaps = true;
    options.dest = _path.default.join(cwd, 'dist', 'umd');
    (0, _rimraf2.default)(options.dest, {
        disableGlob: true
    }, function() {
        var queue = new _queuecb.default(1);
        queue.defer(_tsdslib.spawn.bind(null, 'rollup', [
            '--config',
            _path.default.resolve(root(__dirname), 'dist', 'esm', 'rollup-swc', 'index.mjs'),
            '--input',
            src
        ], {
            cwd: cwd
        }));
        queue.defer(_fs.default.writeFile.bind(null, _path.default.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
        queue.await(cb);
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }