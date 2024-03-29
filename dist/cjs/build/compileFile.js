"use strict";
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
var path = require("path");
var fs = require("fs");
var Queue = require("queue-cb");
var once = require("call-once-fn");
var mkdirp = require("mkdirp");
var transformSync = require("ts-swc-loaders").transformSync;
var regexDependencies = require("./regexDependencies");
var regexESM = regexDependencies(true);
var regexCJS = regexDependencies();
var importReplaceMJS = [
    ".js",
    ".ts",
    ".tsx",
    ".mts",
    ".mjs"
];
var importReplaceCJS = [
    ".cts"
];
var requireReplaceJS = [
    ".mjs",
    ".cjs",
    ".ts",
    ".tsx",
    ".mts",
    ".cts"
];
function makeReplacements(code, regex, extensions, extension) {
    var _loop = function() {
        var dependency = match[1] || match[2] || match[3] || match[4];
        var ext = extensions.find(function(x) {
            return dependency.slice(-x.length) === x;
        });
        if (ext) matches.push({
            ext: ext,
            match: match,
            dependency: dependency
        });
        match = regex.exec(code);
    };
    var matches = [];
    var match = regex.exec(code);
    while(match)_loop();
    matches = matches.reverse();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var match1 = _step.value;
            var start = match1.match.index + match1.match[0].indexOf(match1.dependency) + match1.dependency.indexOf(match1.ext);
            code = code.substring(0, start) + extension + code.substring(start + match1.ext.length);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return code;
}
// https://github.com/vercel/next.js/blob/20b63e13ab2631d6043277895d373aa31a1b327c/packages/next/taskfile-swc.js#L118-L125
var interopClientDefaultExport = "/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }";
module.exports = function compileFile(entry, options, callback) {
    fs.readFile(entry.fullPath, "utf8", function(err, contents) {
        if (err) return callback(err);
        callback = once(callback);
        try {
            var config = options.config;
            // overrides for cjs
            if (options.type === "cjs") {
                config = _object_spread({}, config);
                config.config = _object_spread({}, config.config || {});
                config.config.compilerOptions = _object_spread({}, config.config.compilerOptions || {});
                config.config.compilerOptions.module = "CommonJS";
                config.config.compilerOptions.target = "ES5";
            }
            var output = transformSync(contents, entry.basename, config);
            var relname = entry.path.replace(/\.[^/.]+$/, "");
            var ext = path.extname(entry.path);
            // patch .mjs imports
            if (options.type === "esm") {
                ext = importReplaceMJS.indexOf(ext) >= 0 ? ".mjs" : ext;
                output.code = makeReplacements(output.code, regexESM, importReplaceMJS, ".mjs");
                ext = importReplaceCJS.indexOf(ext) >= 0 ? ".cjs" : ext;
                output.code = makeReplacements(output.code, regexESM, importReplaceCJS, ".cjs");
            } else {
                ext = requireReplaceJS.indexOf(ext) >= 0 ? ".js" : ext;
                output.code = makeReplacements(output.code, regexCJS, requireReplaceJS, ".js");
                output.code += interopClientDefaultExport;
            }
            mkdirp(path.dirname(path.join(options.dest, relname + ext)), function() {
                var outQueue = new Queue();
                outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, relname + ext), output.code, "utf8"));
                !options.sourceMaps || outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, "".concat(relname + ext, ".map")), output.map, "utf8"));
                outQueue.await(callback);
            });
        } catch (err) {
            callback(err);
        }
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }