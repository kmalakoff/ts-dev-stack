"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return link;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _mkdirp = /*#__PURE__*/ _interop_require_default(require("mkdirp"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _unlink = /*#__PURE__*/ _interop_require_default(require("./unlink.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
var symlinkType = isWindows ? 'junction' : 'dir';
function saveLink(target, cb) {
    var movedPath = _path.default.join(_path.default.dirname(target), "".concat(_path.default.basename(target), ".tsds"));
    var queue = new _queuecb.default(1);
    queue.defer(_fs.default.rename.bind(null, target, movedPath));
    queue.defer(createLink.bind(null, target));
    queue.await(cb);
}
function createLink(target, cb) {
    var queue = new _queuecb.default(1);
    queue.defer(function(cb) {
        (0, _mkdirp.default)(_path.default.dirname(target), function() {
            cb();
        });
    });
    queue.defer(_fs.default.symlink.bind(null, process.cwd(), target, symlinkType));
    queue.await(cb);
}
function removeLink(target, cb) {
    _fs.default.unlink(target, cb);
}
function link(target, cb) {
    try {
        _fs.default.lstat(target, function(_, lstat) {
            // new
            if (!lstat) {
                createLink(target, function(err) {
                    err ? cb(err) : cb(null, removeLink.bind(null, target));
                });
            } else if (lstat.isDirectory()) {
                saveLink(target, function(err) {
                    err ? cb(err) : cb(null, _unlink.default.bind(null, target));
                });
            } else {
                removeLink(target, function() {
                    createLink(target, function(err) {
                        err ? cb(err) : cb(null, removeLink.bind(null, target));
                    });
                });
            }
        });
    } catch (err) {
        return cb(err);
    }
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }