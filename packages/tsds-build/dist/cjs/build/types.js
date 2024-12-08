"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return types;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _fsiterator = /*#__PURE__*/ _interop_require_default(require("fs-iterator"));
var _gettsconfigcompat = /*#__PURE__*/ _interop_require_default(require("get-tsconfig-compat"));
var _resolve = /*#__PURE__*/ _interop_require_default(require("resolve"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
var _tsswctransform = require("ts-swc-transform");
var _tsdslib = require("tsds-lib");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
function types(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = (0, _tsdslib.source)(options);
    var srcFolder = _path.default.dirname(_path.default.resolve(cwd, src));
    var dest = _path.default.join(cwd, 'dist', 'types');
    var config = _gettsconfigcompat.default.getTsconfig(_path.default.resolve(cwd, 'tsconfig.json'));
    var matcher = (0, _tsswctransform.createMatcher)(config);
    var tsArgs = [];
    for(var key in config.config.compilerOptions){
        var value = config.config.compilerOptions[key];
        tsArgs.push("--".concat(key));
        tsArgs.push(Array.isArray(value) ? value.join(',') : value);
    }
    (0, _rimraf2.default)(dest, {
        disableGlob: true
    }, function() {
        var files = [];
        var iterator = new _fsiterator.default(srcFolder);
        iterator.forEach(function(entry, callback) {
            if (!entry.stats.isFile()) return callback();
            if (!matcher(entry.fullPath)) return callback();
            files.push(entry.fullPath);
            callback();
        }, {
            callbacks: true,
            concurrency: 1024
        }, function(err) {
            if (err) return cb(err);
            var args = [
                'tsc'
            ].concat(_to_consumable_array(files), [
                '--declaration',
                '--emitDeclarationOnly',
                '--outDir',
                dest
            ], _to_consumable_array(tsArgs));
            if (major < 14) args = [
                nvu,
                'stable'
            ].concat(_to_consumable_array(args));
            (0, _tsdslib.spawn)(args[0], args.slice(1), {
                cwd: cwd
            }, cb);
        });
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }