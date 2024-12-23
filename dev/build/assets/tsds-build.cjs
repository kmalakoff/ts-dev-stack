(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path'), require('queue-cb'), require('rimraf2'), require('fs'), require('mkdirp-classic'), require('resolve'), require('url'), require('cross-spawn-cb'), require('env-path-key'), require('path-string-prepend'), require('ts-swc-transform')) :
    typeof define === 'function' && define.amd ? define(['path', 'queue-cb', 'rimraf2', 'fs', 'mkdirp-classic', 'resolve', 'url', 'cross-spawn-cb', 'env-path-key', 'path-string-prepend', 'ts-swc-transform'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tsdsBuild = factory(global.path, global.Queue, global.rimraf2, global.fs, null, global.resolve, global.url, global.crossSpawn, global.pathKey, global.prepend, global.tsSwcTransform));
})(this, (function (path, Queue, rimraf2, fs, mkdirp, resolve, url, crossSpawn, pathKey, prepend, tsSwcTransform) { 'use strict';

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

    function cjs$1(_args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const src = path.dirname(path.resolve(cwd, config(options).source));
        const dest = path.join(cwd, 'dist', 'cjs');
        rimraf2(dest, {
            disableGlob: true
        }, ()=>{
            const queue = new Queue(1);
            queue.defer(tsSwcTransform.transformDirectory.bind(null, src, dest, 'cjs', {
                ...options,
                type: 'cjs',
                sourceMaps: true
            }));
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
            queue.await(cb);
        });
    }

    function esm(_args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const src = path.dirname(path.resolve(cwd, config(options).source));
        const dest = path.join(cwd, 'dist', 'esm');
        rimraf2(dest, {
            disableGlob: true
        }, ()=>{
            const queue = new Queue(1);
            queue.defer(tsSwcTransform.transformDirectory.bind(null, src, dest, 'esm', {
                ...options,
                type: 'esm',
                sourceMaps: true
            }));
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"module"}'));
            queue.await(cb);
        });
    }

    function cjs(_args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const src = path.dirname(path.resolve(cwd, config(options).source));
        const dest = path.join(cwd, 'dist', 'types');
        rimraf2(dest, {
            disableGlob: true
        }, ()=>{
            tsSwcTransform.transformTypes(src, dest, cb);
        });
    }

    const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath((typeof document === 'undefined' && typeof location === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : typeof document === 'undefined' ? location.href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('tsds-build.cjs', document.baseURI).href))));
    const major = +process.versions.node.split('.')[0];
    const nvu = binPath(resolve.sync('node-version-use/package.json', {
        basedir: __dirname
    }), 'nvu');
    const configPath = path.resolve(packageRoot(__dirname), 'dist', 'esm', 'rollup.config.mjs');
    function umd(_args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const src = path.resolve(cwd, config(options).source);
        const dest = path.join(cwd, 'dist', 'umd');
        rimraf2(dest, {
            disableGlob: true
        }, ()=>{
            const queue = new Queue(1);
            (()=>{
                let args = [
                    'rollup',
                    '--config',
                    configPath,
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
        const { targets } = config(options);
        const clean = options.clean === undefined ? true : options.clean;
        const cwd = options.cwd || process.cwd();
        const queue = new Queue(1);
        !clean || queue.defer((cb)=>rimraf2(path.join(cwd, 'dist'), {
                disableGlob: true
            }, cb.bind(null, null)));
        targets.indexOf('cjs') < 0 || queue.defer(cjs$1.bind(null, args, options));
        targets.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
        targets.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
        queue.defer(cjs.bind(null, args, options));
        queue.await(cb);
    }

    return build;

}));
