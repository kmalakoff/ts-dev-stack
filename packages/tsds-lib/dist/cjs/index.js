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
    extensions: function() {
        return _extensions.default;
    },
    installPath: function() {
        return _installPath.default;
    },
    link: function() {
        return _link.default;
    },
    optionsToArgs: function() {
        return _optionsToArgs.default;
    },
    source: function() {
        return _source.default;
    },
    spawn: function() {
        return _spawn.default;
    },
    targets: function() {
        return _targets.default;
    },
    unlink: function() {
        return _unlink.default;
    },
    uuid: function() {
        return _uuid.default;
    }
});
var _extensions = /*#__PURE__*/ _interop_require_default(require("./lib/extensions.js"));
var _installPath = /*#__PURE__*/ _interop_require_default(require("./lib/installPath"));
var _link = /*#__PURE__*/ _interop_require_default(require("./lib/link"));
var _optionsToArgs = /*#__PURE__*/ _interop_require_default(require("./lib/optionsToArgs"));
var _source = /*#__PURE__*/ _interop_require_default(require("./lib/source"));
var _spawn = /*#__PURE__*/ _interop_require_default(require("./lib/spawn"));
var _targets = /*#__PURE__*/ _interop_require_default(require("./lib/targets"));
var _unlink = /*#__PURE__*/ _interop_require_default(require("./lib/unlink"));
var _uuid = /*#__PURE__*/ _interop_require_default(require("./lib/uuid"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }