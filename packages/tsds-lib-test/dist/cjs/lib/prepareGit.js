"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return prepareGit;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _crossspawncb = /*#__PURE__*/ _interop_require_default(require("cross-spawn-cb"));
var _fsaccesscompat = /*#__PURE__*/ _interop_require_default(require("fs-access-compat"));
var _mkdirp = /*#__PURE__*/ _interop_require_default(require("mkdirp"));
var _osshim = require("os-shim");
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
var _shorthash = /*#__PURE__*/ _interop_require_default(require("short-hash"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function prepareGit(git, options, callback) {
    var cwd = options.cwd || process.cwd();
    var pkg = JSON.parse(_fs.default.readFileSync(_path.default.join(cwd, 'package.json'), 'utf8'));
    var dest = _path.default.join((0, _osshim.tmpdir)(), pkg.name, (0, _shorthash.default)(cwd));
    var targetName = _path.default.basename(git, _path.default.extname(git));
    var targetPath = _path.default.join(dest, targetName);
    _mkdirp.default.sync(dest);
    (0, _fsaccesscompat.default)(targetPath, function(err) {
        if (!err && options.clean) {
            _rimraf2.default.sync(targetPath, {
                disableGlob: true
            });
            err = true;
        }
        var queue = new _queuecb.default(1);
        // does not exist - clone
        if (err) {
            queue.defer(_crossspawncb.default.bind(null, 'git', [
                'clone',
                git
            ], {
                stdio: 'inherit',
                cwd: dest
            }));
        } else {
            queue.defer(_crossspawncb.default.bind(null, 'git', [
                'clean',
                '-fd'
            ], {
                stdio: 'inherit',
                cwd: targetPath
            }));
            queue.defer(_crossspawncb.default.bind(null, 'git', [
                'reset',
                '--hard',
                'HEAD'
            ], {
                stdio: 'inherit',
                cwd: targetPath
            }));
            queue.defer(_crossspawncb.default.bind(null, 'git', [
                'pull',
                '--rebase'
            ], {
                stdio: 'inherit',
                cwd: targetPath
            }));
        }
        queue.await(callback);
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }