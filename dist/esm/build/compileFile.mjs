const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
const once = require('call-once-fn');
const assign = require('just-extend');
const mkdirp = require('mkdirp');
const { transformSync } = require('ts-swc-loaders');
const regexDependencies = require('./regexDependencies');
const regexESM = regexDependencies(true);
const regexCJS = regexDependencies();
const importReplaceMJS = [
    '.js',
    '.ts',
    '.tsx',
    '.mts',
    '.mjs'
];
const importReplaceCJS = [
    '.cts'
];
const requireReplaceJS = [
    '.mjs',
    '.cjs',
    '.ts',
    '.tsx',
    '.mts',
    '.cts'
];
function makeReplacements(code, regex, extensions, extension) {
    let matches = [];
    let match = regex.exec(code);
    while(match){
        const dependency = match[1] || match[2] || match[3] || match[4];
        const ext = extensions.find((x)=>dependency.slice(-x.length) === x);
        if (ext) matches.push({
            ext,
            match,
            dependency
        });
        match = regex.exec(code);
    }
    matches = matches.reverse();
    for (const match of matches){
        const start = match.match.index + match.match[0].indexOf(match.dependency) + match.dependency.indexOf(match.ext);
        code = code.substring(0, start) + extension + code.substring(start + match.ext.length);
    }
    return code;
}
// https://github.com/vercel/next.js/blob/20b63e13ab2631d6043277895d373aa31a1b327c/packages/next/taskfile-swc.js#L118-L125
const interopClientDefaultExport = [
    '',
    "if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {",
    "  Object.defineProperty(exports.default, '__esModule', { value: true });",
    '  for (var key in exports) exports.default[key] = exports[key];',
    '  module.exports = exports.default;',
    '}'
].join('\n');
module.exports = function compileFile(entry, options, callback) {
    fs.readFile(entry.fullPath, 'utf8', (err, contents)=>{
        if (err) return callback(err);
        callback = once(callback);
        try {
            let config = options.config;
            // overrides for cjs
            if (options.type === 'cjs') {
                config = assign({}, config);
                config.config = assign({}, config.config);
                config.config.compilerOptions = assign({}, config.config.compilerOptions);
                config.config.compilerOptions.module = 'CommonJS';
                config.config.compilerOptions.target = 'ES5';
            }
            const output = transformSync(contents, entry.basename, config);
            const relname = entry.path.replace(/\.[^/.]+$/, '');
            let ext = path.extname(entry.path);
            // patch .mjs imports
            if (options.type === 'esm') {
                ext = importReplaceMJS.indexOf(ext) >= 0 ? '.mjs' : ext;
                output.code = makeReplacements(output.code, regexESM, importReplaceMJS, '.mjs');
                ext = importReplaceCJS.indexOf(ext) >= 0 ? '.cjs' : ext;
                output.code = makeReplacements(output.code, regexESM, importReplaceCJS, '.cjs');
            } else {
                ext = requireReplaceJS.indexOf(ext) >= 0 ? '.js' : ext;
                output.code = makeReplacements(output.code, regexCJS, requireReplaceJS, '.js');
                output.code += interopClientDefaultExport;
            }
            mkdirp(path.dirname(path.join(options.dest, relname + ext)), ()=>{
                const outQueue = new Queue();
                outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, relname + ext), output.code, 'utf8'));
                !options.sourceMaps || outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, `${relname + ext}.map`), output.map, 'utf8'));
                outQueue.await(callback);
            });
        } catch (err) {
            callback(err);
        }
    });
};
