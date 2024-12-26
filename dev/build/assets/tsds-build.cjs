(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path'), require('queue-cb'), require('rimraf2'), require('fs'), require('mkdirp-classic'), require('temp-suffix'), require('resolve'), require('url'), require('cross-spawn-cb'), require('env-path-key'), require('path-string-prepend'), require('lazy-cache'), require('ts-swc-transform')) :
    typeof define === 'function' && define.amd ? define(['path', 'queue-cb', 'rimraf2', 'fs', 'mkdirp-classic', 'temp-suffix', 'resolve', 'url', 'cross-spawn-cb', 'env-path-key', 'path-string-prepend', 'lazy-cache', 'ts-swc-transform'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tsdsBuild = factory(global.path, global.Queue, global.rimraf2, global.fs, null, null, null, global.url, global.crossSpawn, global.pathKey, global.prepend, global.require$$0, global.tsSwcTransform));
})(this, (function (path, Queue, rimraf2, fs, mkdirp, tempSuffix, resolve, url, crossSpawn, pathKey, prepend, require$$0, tsSwcTransform) { 'use strict';

    var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
    const defaults = {
        source: 'src/index.ts',
        targets: [
            'cjs',
            'esm'
        ],
        commands: {
            build: 'tsds-build',
            coverage: 'tsds-c8',
            publish: './commands/publish.js',
            prepublish: './commands/prepublish.js',
            docs: 'tsds-typedoc',
            format: 'tsds-biome',
            link: './commands/link.js',
            'test:node': 'tsds-mocha',
            'test:browser': 'tsds-web-test-runner',
            unlink: './commands/unlink.js',
            version: './commands/version.js'
        }
    };
    function config(options = {}) {
        if (options.config) return options.config;
        const cwd = options.cwd || process.cwd();
        const tsds = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8')).tsds || {};
        if (!tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
        return {
            ...defaults,
            ...tsds
        };
    }

    process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);

    function existsSyncPolyfill(path) {
        try {
            fs.accessSync(path);
            return true;
        } catch (_) {
            return false;
        }
    }
    var existsSync = fs.accessSync ? existsSyncPolyfill : fs.existsSync;

    function packageRoot(dir) {
        const packagePath = path.join(dir, 'package.json');
        if (existsSync(packagePath) && JSON.parse(fs.readFileSync(packagePath, 'utf8')).name) return dir;
        const nextDir = path.dirname(dir);
        if (nextDir === dir) throw new Error('Package root not found');
        return packageRoot(nextDir);
    }

    const __dirname$1 = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath((typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('tsds-build.cjs', document.baseURI).href))));
    const root = packageRoot(__dirname$1);
    function spawn(cmd, args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const PATH_KEY = pathKey(options);
        const env = {
            ...process.env,
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

    function getDefaultExportFromCjs(x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function commonjsRequire(path) {
        throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
    }

    var lazy$1;
    var hasRequiredLazy;
    function requireLazy() {
        if (hasRequiredLazy) return lazy$1;
        hasRequiredLazy = 1;
        lazy$1 = require$$0(commonjsRequire);
        return lazy$1;
    }

    var lazyExports = requireLazy();
    var lazy = /*@__PURE__*/ getDefaultExportFromCjs(lazyExports);

    // @ts-ignore
    const call = lazy('node-version-call');
    function wrapWorker(workerPath) {
        return function workerWrapper(version, ...args) {
            if (version === 'local') return lazy(workerPath)().apply(null, args);
            const callback = args.pop();
            try {
                callback(null, call()({
                    version,
                    callbacks: true
                }, workerPath, ...args));
            } catch (err) {
                callback(err);
            }
        };
    }

    function transform(_args, type, options, cb) {
        const cwd = options.cwd || process.cwd();
        const src = path.dirname(path.resolve(cwd, config(options).source));
        const dest = path.join(cwd, 'dist', type);
        const queue = new Queue(1);
        queue.defer((cb)=>rimraf2(dest, {
                disableGlob: true
            }, cb.bind(null, null)));
        queue.defer((cb)=>tsSwcTransform.transformDirectory(src, dest, type, {
                ...options,
                type,
                sourceMaps: true
            }, (err, results)=>{
                console.log(err ? `${type} failed: ${err.message} from ${src}` : `created ${results.map((x)=>`dist/${x.to}`).join(',')}`);
                cb(err);
            }));
        queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
        queue.await(cb);
    }

    function cjs(_args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const src = path.dirname(path.resolve(cwd, config(options).source));
        const dest = path.join(cwd, 'dist', 'types');
        const queue = new Queue(1);
        queue.defer((cb)=>rimraf2(dest, {
                disableGlob: true
            }, cb.bind(null, null)));
        queue.defer((cb)=>tsSwcTransform.transformTypes(src, dest, (err, results)=>{
                console.log(err ? `Types failed: ${err.message} from ${src}` : `created ${results.map((x)=>`dist/${x.to}`).join(',')}`);
                cb(err);
            }));
        queue.await(cb);
    }

    const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath((typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('tsds-build.cjs', document.baseURI).href))));
    const major = +process.versions.node.split('.')[0];
    const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'build', 'umd.js'));
    const configPath = path.join(packageRoot(__dirname), 'dist', 'esm', 'rollup.config.mjs');
    function worker(_args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const src = path.resolve(cwd, config(options).source);
        const dest = path.join(cwd, 'dist', 'umd');
        const args = [
            'rollup',
            '--config',
            configPath,
            '--input',
            src
        ];
        const queue = new Queue(1);
        queue.defer((cb)=>rimraf2(dest, {
                disableGlob: true
            }, cb.bind(null, null)));
        queue.defer(spawn.bind(null, args[0], args.slice(1), {
            cwd
        }));
        queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
        queue.await(cb);
    }
    function umd(args, options, cb) {
        major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
    }

    function build(args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const { targets } = config(options);
        const clean = options.clean === undefined ? true : options.clean;
        const dest = path.join(cwd, 'dist');
        const queue = new Queue(1);
        !clean || queue.defer((cb)=>rimraf2(dest, {
                disableGlob: true
            }, cb.bind(null, null)));
        targets.indexOf('cjs') < 0 || queue.defer(transform.bind(null, args, 'cjs', options));
        targets.indexOf('esm') < 0 || queue.defer(transform.bind(null, args, 'esm', options));
        targets.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
        queue.defer(cjs.bind(null, args, options));
        queue.await(cb);
    }

    return build;

}));
