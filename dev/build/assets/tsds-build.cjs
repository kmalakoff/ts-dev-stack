(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path'), require('queue-cb'), require('rimraf2'), require('mkdirp-classic'), require('resolve'), require('url'), require('cross-spawn-cb'), require('env-path-key'), require('path-string-prepend'), require('fs'), require('ts-swc-transform'), require('fs-iterator'), require('get-tsconfig-compat')) :
        typeof define === 'function' && define.amd ? define(['path', 'queue-cb', 'rimraf2', 'mkdirp-classic', 'resolve', 'url', 'cross-spawn-cb', 'env-path-key', 'path-string-prepend', 'fs', 'ts-swc-transform', 'fs-iterator', 'get-tsconfig-compat'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tsdsBuild = factory(global.path, global.Queue, global.rimraf2, null, global.resolve, global.url, global.crossSpawn, global.pathKey, global.prepend, global.fs, global.tsSwcTransform, global.Iterator, global.getTS));
})(this, (function (path, Queue, rimraf2, mkdirp, resolve, url, crossSpawn, pathKey, prepend, fs, tsSwcTransform, Iterator, getTS) {
    'use strict';

    var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
    function binPath(packagePath, binName) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (!pkg) throw new Error(`Module binary package not found. Module: ${packagePath}`);
        // one of the bin entries
        {
            if (typeof pkg.bin[binName] !== 'string') throw new Error(`Module binary not found. Module: ${packagePath}. Binary: ${binName}`);
            return path.resolve.apply(null, [
                path.dirname(packagePath),
                ...pkg.bin[binName].split('/')
            ]);
        }
    }

    function getDefaultExportFromCjs(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var process_1$1;
    var hasRequiredProcess$1;
    function requireProcess$1() {
        if (hasRequiredProcess$1) return process_1$1;
        hasRequiredProcess$1 = 1;
        process_1$1 = process;
        return process_1$1;
    }

    var processExports$1 = requireProcess$1();
    var process$2 = /*@__PURE__*/ getDefaultExportFromCjs(processExports$1);

    function config$1(options = {}) {
        const cwd = options.cwd || process$2.cwd();
        return options.config || JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8')).tsds || {};
    }

    process$2.platform === 'win32' || /^(msys|cygwin)$/.test(process$2.env.OSTYPE);

    function packageRoot(dir, packageName) {
        if (path.basename(dir) === packageName) return dir;
        const nextDir = path.dirname(dir);
        if (nextDir === dir) throw new Error(`${packageName} not found`);
        return packageRoot(nextDir, packageName);
    }

    function source(options) {
        const tsds = config$1(options);
        if (!tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
        return (tsds.source ? tsds.source.split('/') : [
            'src',
            'index.ts'
        ]).join(path.sep);
    }

    const __dirname$2 = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath((typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('tsds-build.cjs', document.baseURI).href))));
    let root;
    try {
        root = packageRoot(__dirname$2, 'tsds-lib');
    } catch (_) {
        root = packageRoot(__dirname$2, 'build');
    }
    function spawn(cmd, args, options, cb) {
        const cwd = options.cwd || process$2.cwd();
        const PATH_KEY = pathKey(options);
        const env = {
            ...process$2.env,
            env: options.env || {}
        };
        env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(root, '..', '..', 'node_modules', '.bin'));
        env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(cwd, 'node_modules', '.bin'));
        crossSpawn(cmd, args, {
            stdio: 'inherit',
            cwd,
            env: env
        }, cb);
    }

    function targets(options) {
        const tsds = config$1(options);
        return tsds.targets || [
            'cjs',
            'esm',
            'umd'
        ];
    }

    var process_1;
    var hasRequiredProcess;
    function requireProcess() {
        if (hasRequiredProcess) return process_1;
        hasRequiredProcess = 1;
        process_1 = process;
        return process_1;
    }

    var processExports = requireProcess();
    var process$1 = /*@__PURE__*/ getDefaultExportFromCjs(processExports);

    function cjs(_args, options, cb) {
        const cwd = options.cwd || process$1.cwd();
        const src = source(options);
        const srcDir = path.dirname(path.resolve(cwd, src));
        const dest = path.join(cwd, 'dist', 'cjs');
        rimraf2(dest, {
            disableGlob: true
        }, () => {
            const queue = new Queue(1);
            queue.defer(tsSwcTransform.transformDirectory.bind(null, srcDir, dest, 'cjs', {
                ...options,
                type: 'cjs',
                sourceMaps: true
            }));
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
            queue.await(cb);
        });
    }

    function esm(_args, options, cb) {
        const cwd = options.cwd || process$1.cwd();
        const src = source(options);
        const srcDir = path.dirname(path.resolve(cwd, src));
        const dest = path.join(cwd, 'dist', 'esm');
        rimraf2(dest, {
            disableGlob: true
        }, () => {
            const queue = new Queue(1);
            queue.defer(tsSwcTransform.transformDirectory.bind(null, srcDir, dest, 'esm', {
                ...options,
                type: 'esm',
                sourceMaps: true
            }));
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"module"}'));
            queue.await(cb);
        });
    }

    const __dirname$1 = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath((typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('tsds-build.cjs', document.baseURI).href))));
    const major$1 = typeof process$1 === 'undefined' ? Infinity : +process$1.versions.node.split('.')[0];
    const nvu$1 = binPath(resolve.sync('node-version-use/package.json', {
        basedir: __dirname$1
    }), 'nvu');
    function types(_args, options, cb) {
        const cwd = options.cwd || process$1.cwd();
        const src = source(options);
        const srcDir = path.dirname(path.resolve(cwd, src));
        const dest = path.join(cwd, 'dist', 'types');
        const config = getTS.getTsconfig(path.resolve(cwd, 'tsconfig.json'));
        const matcher = tsSwcTransform.createMatcher(config);
        const tsArgs = [];
        for (const key in config.config.compilerOptions) {
            const value = config.config.compilerOptions[key];
            tsArgs.push(`--${key}`);
            tsArgs.push(Array.isArray(value) ? value.join(',') : value);
        }
        rimraf2(dest, {
            disableGlob: true
        }, () => {
            const files = [];
            const iterator = new Iterator(srcDir);
            iterator.forEach((entry, callback) => {
                if (!entry.stats.isFile()) return callback();
                if (!matcher(entry.fullPath)) return callback();
                files.push(entry.fullPath);
                callback();
            }, {
                callbacks: true,
                concurrency: 1024
            }, (err) => {
                if (err) return cb(err);
                let args = [
                    'tsc',
                    ...files,
                    '--declaration',
                    '--emitDeclarationOnly',
                    '--outDir',
                    dest,
                    ...tsArgs
                ];
                if (major$1 < 14) args = [
                    nvu$1,
                    'stable',
                    ...args
                ];
                spawn(args[0], args.slice(1), {
                    cwd
                }, cb);
            });
        });
    }

    const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath((typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('tsds-build.cjs', document.baseURI).href))));
    const major = typeof process$1 === 'undefined' ? Infinity : +process$1.versions.node.split('.')[0];
    const nvu = binPath(resolve.sync('node-version-use/package.json', {
        basedir: __dirname
    }), 'nvu');
    const config = path.resolve(packageRoot(__dirname, 'build'), 'dist', 'esm', 'rollup.config.mjs');
    function umd(_args, options, cb) {
        const cwd = options.cwd || process$1.cwd();
        const src = path.resolve(cwd, source(options));
        const dest = path.join(cwd, 'dist', 'umd');
        rimraf2(dest, {
            disableGlob: true
        }, () => {
            const queue = new Queue(1);
            (() => {
                let args = [
                    'rollup',
                    '--config',
                    config,
                    '--input',
                    src
                ];
                if (major < 14) args = [
                    nvu,
                    'stable',
                    ...args
                ];
                queue.defer(spawn.bind(null, args[0], args.slice(1), {
                    cwd
                }));
            })();
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
            queue.await(cb);
        });
    }

    function build(args, options, cb) {
        const targs = targets(options);
        const clean = options.clean === undefined ? true : options.clean;
        const cwd = options.cwd || process$1.cwd();
        const queue = new Queue(1);
        !clean || queue.defer((cb) => rimraf2(path.join(cwd, 'dist'), {
            disableGlob: true
        }, cb.bind(null, null)));
        targs.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
        targs.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
        targs.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
        queue.defer(types.bind(null, args, options));
        queue.await(cb);
    }

    return build;

}));
