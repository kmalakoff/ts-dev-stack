"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return data;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _crossspawncb = /*#__PURE__*/ _interop_require_default(require("cross-spawn-cb"));
var _mkdirp = /*#__PURE__*/ _interop_require_default(require("mkdirp"));
var _osshim = require("os-shim");
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _shorthash = /*#__PURE__*/ _interop_require_default(require("short-hash"));
var _prepareGit = /*#__PURE__*/ _interop_require_default(require("./prepareGit.js"));
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
function data(git, options, callback) {
    var cwd = options.cwd || process.cwd();
    var pkg = JSON.parse(_fs.default.readFileSync(_path.default.join(cwd, 'package.json'), 'utf8'));
    var dest = _path.default.join((0, _osshim.tmpdir)(), pkg.name, (0, _shorthash.default)(cwd));
    var targetName = _path.default.basename(git, _path.default.extname(git));
    var targetPath = _path.default.join(dest, targetName);
    _mkdirp.default.sync(dest);
    var queue = new _queuecb.default(1);
    for(var binName in pkg.bin){
        var packagePath = _path.default.resolve(targetPath, 'node_modules', pkg.name);
        var binPath = _path.default.resolve(targetPath, 'node_modules', '.bin', binName);
        console.log('------------------');
        console.log("Preparing: ".concat(targetPath));
        // clone or reset the git repo
        queue.defer(_prepareGit.default.bind(null, git, options));
        // install
        queue.defer(_crossspawncb.default.bind(null, 'nvu', [
            'lts',
            '--silent',
            'npm',
            'install'
        ], {
            cwd: targetPath
        }));
        // link package
        queue.defer(_fs.default.rename.bind(null, packagePath, "".concat(packagePath, ".tsds")));
        queue.defer(_fs.default.symlink.bind(null, cwd, packagePath, 'dir'));
        // link bin
        queue.defer(_fs.default.rename.bind(null, binPath, "".concat(binPath, ".tsds")));
        queue.defer(_fs.default.symlink.bind(null, _path.default.resolve.apply(null, [
            cwd
        ].concat(_to_consumable_array(pkg.bin[binName].split('/')))), binPath, 'file'));
        queue.await(function(err) {
            console.log('------------------');
            err ? callback(err) : callback(null, targetPath);
        });
    }
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }