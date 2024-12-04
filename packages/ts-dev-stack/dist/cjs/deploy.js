"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return deploy;
    }
});
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _tsdslib = require("tsds-lib");
var _predeploy = /*#__PURE__*/ _interop_require_default(require("./predeploy.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function postdeploy(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    (0, _tsdslib.spawn)('gh-pages', [
        '-d',
        'docs'
    ], {
        cwd: cwd
    }, cb);
}
function deploy(args, options, cb) {
    var npArgs = [];
    if (options['no-publish']) npArgs.push('--no-publish');
    if (options.preview) npArgs.push('--preview');
    if (!options.yarn) npArgs.push('--no-yarn');
    var queue = new _queuecb.default(1);
    queue.defer(_predeploy.default.bind(null, args, options));
    queue.defer(_tsdslib.spawn.bind(null, 'np', npArgs, {}));
    queue.defer(postdeploy.bind(null, args, options));
    queue.await(cb);
}
module.exports.options = {
    alias: {
        'no-publish': 'np',
        preview: 'p',
        yarn: 'y'
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }