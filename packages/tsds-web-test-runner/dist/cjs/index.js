"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createConfig: function() {
        return _createConfig.default;
    },
    default: function() {
        return _command.default;
    },
    packageVersion: function() {
        return _packageVersion.default;
    }
});
var _command = /*#__PURE__*/ _interop_require_default(require("./command.js"));
var _createConfig = /*#__PURE__*/ _interop_require_default(require("./config/createConfig.js"));
var _packageVersion = /*#__PURE__*/ _interop_require_default(require("./config/packageVersion.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }