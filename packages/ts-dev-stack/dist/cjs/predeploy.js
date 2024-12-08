"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return predeploy;
    }
});
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _tsdsbiome = /*#__PURE__*/ _interop_require_default(require("tsds-biome"));
var _tsdsbuild = /*#__PURE__*/ _interop_require_default(require("tsds-build"));
var _resolve = /*#__PURE__*/ _interop_require_default(require("resolve"));
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
function predeploy(args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var queue = new _queuecb.default(1);
    queue.defer(_tsdsbiome.default.bind(null, args, options));
    queue.defer(_tsdsbuild.default.bind(null, args, options));
    (function() {
        var _$args = [
            'sort-package-json'
        ];
        if (major < 14) _$args = [
            nvu,
            'stable'
        ].concat(_to_consumable_array(_$args));
        queue.defer(_tsdslib.spawn.bind(null, _$args[0], _$args.slice(1), {
            cwd: cwd
        }));
    })();
    (function() {
        var _$args = [
            'depcheck'
        ];
        if (major < 14) _$args = [
            nvu,
            'stable'
        ].concat(_to_consumable_array(_$args));
        queue.defer(_tsdslib.spawn.bind(null, _$args[0], _$args.slice(1), {
            cwd: cwd
        }));
    })();
    queue.await(cb);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }