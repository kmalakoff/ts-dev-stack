"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return binPath;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function binPath(packagePath, binName) {
    var pkg = JSON.parse(_fs.default.readFileSync(packagePath, 'utf8'));
    if (!pkg || !pkg.bin[binName]) throw new Error("Module binary not found. Module: ".concat(packagePath, ". Binary: ").concat(binName));
    return _path.default.resolve.apply(null, [
        _path.default.dirname(packagePath)
    ].concat(pkg.bin[binName].split('/')));
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }