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
        return _build.default;
    },
    coverage: function() {
        return _c8.default;
    },
    deploy: function() {
        return _deploy.default;
    },
    docs: function() {
        return _docs.default;
    },
    format: function() {
        return _format.default;
    },
    link: function() {
        return _link.default;
    },
    predeploy: function() {
        return _pre.default;
    },
    test: function() {
        return _test.default;
    },
    testBrowser: function() {
        return _karma.default;
    },
    testNode: function() {
        return _tsdsmocha.mocha;
    },
    unlink: function() {
        return _unlink.default;
    },
    version: function() {
        return _version.default;
    }
});
var _build = /*#__PURE__*/ _interop_require_default(require("./build"));
var _c8 = /*#__PURE__*/ _interop_require_default(require("./test/c8"));
var _deploy = /*#__PURE__*/ _interop_require_default(require("./deploy"));
var _docs = /*#__PURE__*/ _interop_require_default(require("./docs"));
var _format = /*#__PURE__*/ _interop_require_default(require("./quality/format"));
var _link = /*#__PURE__*/ _interop_require_default(require("./link"));
var _pre = /*#__PURE__*/ _interop_require_default(require("./deploy/pre"));
var _test = /*#__PURE__*/ _interop_require_default(require("./test"));
var _tsdsmocha = require("tsds-mocha");
var _karma = /*#__PURE__*/ _interop_require_default(require("./test/karma"));
var _unlink = /*#__PURE__*/ _interop_require_default(require("./unlink"));
var _version = /*#__PURE__*/ _interop_require_default(require("./deploy/version"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }