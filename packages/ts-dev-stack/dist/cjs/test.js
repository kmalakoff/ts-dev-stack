"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, // import c8 from './c8.mjs';
"default", {
    enumerable: true,
    get: function() {
        return test;
    }
});
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _tsdskarma = /*#__PURE__*/ _interop_require_default(require("tsds-karma"));
var _tsdsmocha = /*#__PURE__*/ _interop_require_default(require("tsds-mocha"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function test(args, options, cb) {
    var queue = new _queuecb.default(1);
    queue.defer(_tsdsmocha.default.bind(null, args, options));
    queue.defer(_tsdskarma.default.bind(null, args, options));
    // queue.defer(c8.bind(null, args, options));
    queue.await(cb);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }