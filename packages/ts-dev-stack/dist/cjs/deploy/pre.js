"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return predeploy;
    }
});
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _tsdslib = require("tsds-lib");
var _index = /*#__PURE__*/ _interop_require_default(require("../build/index.js"));
var _format = /*#__PURE__*/ _interop_require_default(require("../quality/format.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function predeploy(args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var queue = new _queuecb.default(1);
    queue.defer(_format.default.bind(null, args, options));
    queue.defer(_index.default.bind(null, args, options));
    queue.defer(_tsdslib.spawn.bind(null, 'sort-package-json', [], {
        cwd: cwd
    }));
    queue.defer(_tsdslib.spawn.bind(null, 'depcheck', [], {
        cwd: cwd
    }));
    queue.await(cb);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }