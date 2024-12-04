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
        return _index.default;
    },
    coverage: function() {
        return _c8.default;
    },
    deploy: function() {
        return _index1.default;
    },
    docs: function() {
        return _index2.default;
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
        return _index3.default;
    },
    testBrowser: function() {
        return _karma.default;
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
var _index = /*#__PURE__*/ _interop_require_default(require("./build/index.js"));
var _c8 = /*#__PURE__*/ _interop_require_default(require("./test/c8.js"));
var _index1 = /*#__PURE__*/ _interop_require_default(require("./deploy/index.js"));
var _index2 = /*#__PURE__*/ _interop_require_default(require("./docs/index.js"));
var _format = /*#__PURE__*/ _interop_require_default(require("./quality/format.js"));
var _link = /*#__PURE__*/ _interop_require_default(require("./link.js"));
var _pre = /*#__PURE__*/ _interop_require_default(require("./deploy/pre.js"));
var _index3 = /*#__PURE__*/ _interop_require_default(require("./test/index.js"));
var _tsdsmocha = /*#__PURE__*/ _interop_require_default(require("tsds-mocha"));
var _karma = /*#__PURE__*/ _interop_require_default(require("./test/karma.js"));
var _unlink = /*#__PURE__*/ _interop_require_default(require("./unlink.js"));
var _version = /*#__PURE__*/ _interop_require_default(require("./deploy/version.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }