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
    data: function() {
        return _data.default;
    },
    prepareGit: function() {
        return _prepareGit.default;
    }
});
var _data = /*#__PURE__*/ _interop_require_default(require("./lib/data.js"));
var _prepareGit = /*#__PURE__*/ _interop_require_default(require("./lib/prepareGit.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }