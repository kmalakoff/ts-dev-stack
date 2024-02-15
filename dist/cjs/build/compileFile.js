"use strict";
var path = require("path");
var fs = require("fs");
var Queue = require("queue-cb");
var once = require("call-once-fn");
var assign = require("just-extend");
var mkdirp = require("mkdirp");
var transformSync = require("ts-swc-loaders").transformSync;
var regexDependencies = require("./regexDependencies");
var regexESM = regexDependencies(true);
var regexCJS = regexDependencies();
var importReplaceMJS = [
    ".js",
    ".ts",
    ".tsx",
    ".mts"
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
var interopClientDefaultExport = [
    "",
    "if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {",
    "  Object.defineProperty(exports.default, '__esModule', { value: true });",
    "  for (var key in exports) exports.default[key] = exports[key];",
    "  module.exports = exports.default;",
    "}"
].join("\n");
module.exports = function compileFile(entry, options, callback) {
    fs.readFile(entry.fullPath, "utf8", function(err, contents) {
        if (err) return callback(err);
        callback = once(callback);
        try {
            var config = options.config;
            // overrides for cjs
            if (options.type === "cjs") {
                config = assign({}, config);
                config.config = assign({}, config.config);
                config.config.compilerOptions = assign({}, config.config.compilerOptions);
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

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}