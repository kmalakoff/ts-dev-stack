"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return build;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
var _tsdslib = require("tsds-lib");
var _cjs = /*#__PURE__*/ _interop_require_default(require("./build/cjs.js"));
var _esm = /*#__PURE__*/ _interop_require_default(require("./build/esm.js"));
var _types = /*#__PURE__*/ _interop_require_default(require("./build/types.js"));
var _umd = /*#__PURE__*/ _interop_require_default(require("./build/umd.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function build(args, options, cb) {
    var targs = (0, _tsdslib.targets)(options);
    var cwd = options.cwd || process.cwd();
    (0, _rimraf2.default)(_path.default.join(cwd, 'dist'), {
        disableGlob: true
    }, function() {
        var queue = new _queuecb.default(1);
        targs.indexOf('cjs') < 0 || queue.defer(_cjs.default.bind(null, args, options));
        targs.indexOf('esm') < 0 || queue.defer(_esm.default.bind(null, args, options));
        targs.indexOf('umd') < 0 || queue.defer(_umd.default.bind(null, args, options));
        queue.defer(_types.default.bind(null, args, options));
        queue.await(cb);
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }