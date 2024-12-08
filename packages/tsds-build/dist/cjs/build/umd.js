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
var _resolve = /*#__PURE__*/ _interop_require_default(require("resolve"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
var _tsdslib = require("tsds-lib");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
var nvu = (0, _tsdslib.binPath)(_resolve.default.sync('node-version-use/package.json', {
    basedir: __dirname
}), 'nvu');
function packageRoot(dir, packageName) {
    if (_path.default.basename(dir) === packageName) return dir;
    var nextDir = _path.default.dirname(dir);
    if (nextDir === dir) throw new Error("".concat(packageName, " not found"));
    return packageRoot(nextDir, packageName);
}
var config = _path.default.resolve(packageRoot(__dirname, 'tsds-build'), 'dist', 'esm', 'rollup-swc', 'index.mjs');
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
        (function() {
            var args = [
                'rollup',
                '--config',
                config,
                '--input',
                src
            ];
            if (major < 14) args = [
                nvu,
                'stable'
            ].concat(_to_consumable_array(args));
            queue.defer(_tsdslib.spawn.bind(null, args[0], args.slice(1), {
                cwd: cwd
            }));
        })();
        queue.defer(_fs.default.writeFile.bind(null, _path.default.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
        queue.await(cb);
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }