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
    build: function() {
        return _tsdsbuild.default;
    },
    coverage: function() {
        return _tsdsc8.default;
    },
    deploy: function() {
        return _deploy.default;
    },
    docs: function() {
        return _tsdstypedoc.default;
    },
    format: function() {
        return _tsdsbiome.default;
    },
    link: function() {
        return _link.default;
    },
    predeploy: function() {
        return _predeploy.default;
    },
    test: function() {
        return _test.default;
    },
    testBrowser: function() {
        return _tsdskarma.default;
    },
    testNode: function() {
        return _tsdsmocha.default;
    },
    unlink: function() {
        return _unlink.default;
    },
    version: function() {
        return _version.default;
    }
});
var _tsdsbuild = /*#__PURE__*/ _interop_require_default(require("tsds-build"));
var _tsdsc8 = /*#__PURE__*/ _interop_require_default(require("tsds-c8"));
var _deploy = /*#__PURE__*/ _interop_require_default(require("./deploy.js"));
var _predeploy = /*#__PURE__*/ _interop_require_default(require("./predeploy.js"));
var _tsdstypedoc = /*#__PURE__*/ _interop_require_default(require("tsds-typedoc"));
var _tsdsbiome = /*#__PURE__*/ _interop_require_default(require("tsds-biome"));
var _link = /*#__PURE__*/ _interop_require_default(require("./link.js"));
var _test = /*#__PURE__*/ _interop_require_default(require("./test.js"));
var _tsdsmocha = /*#__PURE__*/ _interop_require_default(require("tsds-mocha"));
var _tsdskarma = /*#__PURE__*/ _interop_require_default(require("tsds-karma"));
var _unlink = /*#__PURE__*/ _interop_require_default(require("./unlink.js"));
var _version = /*#__PURE__*/ _interop_require_default(require("./version.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }