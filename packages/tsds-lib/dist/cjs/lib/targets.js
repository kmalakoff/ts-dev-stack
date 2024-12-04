"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return targets;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function targets(options) {
    var cwd = options.cwd || process.cwd();
    var pkg = JSON.parse(_fs.default.readFileSync(_path.default.resolve(cwd, 'package.json'), 'utf8'));
    if (pkg.tsds && pkg.tsds.targets) return pkg.tsds.targets;
    return [
        'cjs',
        'esm',
        'umd'
    ];
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }