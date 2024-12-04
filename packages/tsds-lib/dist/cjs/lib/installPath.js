"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return installPath;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function installPath(options) {
    options = options || {};
    if (options.installPath) return options.installPath;
    var cwd = options.cwd || process.cwd();
    var pkg = JSON.parse(_fs.default.readFileSync(_path.default.resolve(cwd, 'package.json'), 'utf8'));
    return _path.default.resolve(cwd, 'node_modules', pkg.name);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }