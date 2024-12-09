"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return packageVersion;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _resolve = /*#__PURE__*/ _interop_require_default(require("resolve"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function packageVersion(name) {
    try {
        var packagePath = _resolve.default.sync("".concat(name, "/package.json"));
        var pkg = JSON.parse(_fs.default.readFileSync(packagePath, 'utf8'));
        return pkg.version;
    } catch (_err) {
        return '';
    }
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }