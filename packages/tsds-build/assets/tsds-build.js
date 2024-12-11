(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path'), require('queue-cb'), require('rimraf2'), require('mkdirp'), require('resolve'), require('cross-spawn-cb'), require('env-path-key'), require('path-string-prepend'), require('fs'), require('ts-swc-transform'), require('fs-iterator'), require('get-tsconfig-compat')) :
    typeof define === 'function' && define.amd ? define(['path', 'queue-cb', 'rimraf2', 'mkdirp', 'resolve', 'cross-spawn-cb', 'env-path-key', 'path-string-prepend', 'fs', 'ts-swc-transform', 'fs-iterator', 'get-tsconfig-compat'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tsdsBuild = factory(global.path, global.Queue, global.rimraf2, null, global.resolve, global.crossSpawn, global.pathKey, global.prepend, global.fs, global.tsSwcTransform, global.Iterator, global.getTS));
})(this, (function (path, Queue, rimraf2, mkdirp, resolve, crossSpawn, pathKey, prepend, fs, tsSwcTransform, Iterator, getTS) { 'use strict';

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

    function config$1(options) {
        options = options || {};
        const cwd = options.cwd || process.cwd();
        return options.config || JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8')).tsds || {};
    }

    process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);

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

    function spawn(cmd, args, options, cb) {
        const cwd = options.cwd || process.cwd();
        const PATH_KEY = pathKey(options);
        const env = {
            ...process.env,
            env: options.env || {}
        };
        env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(__dirname, '..', '..', '..', '..', '..', 'node_modules', '.bin'));
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

    function _define_property$1(obj, key, value) {
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
    function _object_spread$1(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i] != null ? arguments[i] : {};
            var ownKeys = Object.keys(source);
            if (typeof Object.getOwnPropertySymbols === "function") {
                ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                }));
            }
            ownKeys.forEach(function(key) {
                _define_property$1(target, key, source[key]);
            });
        }
        return target;
    }
    function ownKeys$1(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            keys.push.apply(keys, symbols);
        }
        return keys;
    }
    function _object_spread_props$1(target, source) {
        source = source != null ? source : {};
        if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys$1(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
        return target;
    }
    function cjs(_args, options, cb) {
        var cwd = options.cwd || process.cwd();
        var src = source(options);
        var srcDir = path.dirname(path.resolve(cwd, src));
        var dest = path.join(cwd, 'dist', 'cjs');
        rimraf2(dest, {
            disableGlob: true
        }, function() {
            var queue = new Queue(1);
            queue.defer(tsSwcTransform.transformDirectory.bind(null, srcDir, dest, 'cjs', _object_spread_props$1(_object_spread$1({}, options), {
                type: 'cjs',
                sourceMaps: true
            })));
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
            queue.await(cb);
        });
    }

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
    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            keys.push.apply(keys, symbols);
        }
        return keys;
    }
    function _object_spread_props(target, source) {
        source = source != null ? source : {};
        if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
        return target;
    }
    function esm(_args, options, cb) {
        var cwd = options.cwd || process.cwd();
        var src = source(options);
        var srcDir = path.dirname(path.resolve(cwd, src));
        var dest = path.join(cwd, 'dist', 'esm');
        rimraf2(dest, {
            disableGlob: true
        }, function() {
            var queue = new Queue(1);
            queue.defer(tsSwcTransform.transformDirectory.bind(null, srcDir, dest, 'esm', _object_spread_props(_object_spread({}, options), {
                type: 'esm',
                sourceMaps: true
            })));
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"module"}'));
            queue.await(cb);
        });
    }

    function _array_like_to_array$1(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
        return arr2;
    }
    function _array_without_holes$1(arr) {
        if (Array.isArray(arr)) return _array_like_to_array$1(arr);
    }
    function _iterable_to_array$1(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
    function _non_iterable_spread$1() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _to_consumable_array$1(arr) {
        return _array_without_holes$1(arr) || _iterable_to_array$1(arr) || _unsupported_iterable_to_array$1(arr) || _non_iterable_spread$1();
    }
    function _unsupported_iterable_to_array$1(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _array_like_to_array$1(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(n);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
    }
    var major$1 = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
    var nvu$1 = binPath(resolve.sync('node-version-use/package.json', {
        basedir: __dirname
    }), 'nvu');
    function types(_args, options, cb) {
        var cwd = options.cwd || process.cwd();
        var src = source(options);
        var srcDir = path.dirname(path.resolve(cwd, src));
        var dest = path.join(cwd, 'dist', 'types');
        var config = getTS.getTsconfig(path.resolve(cwd, 'tsconfig.json'));
        var matcher = tsSwcTransform.createMatcher(config);
        var tsArgs = [];
        for(var key in config.config.compilerOptions){
            var value = config.config.compilerOptions[key];
            tsArgs.push("--".concat(key));
            tsArgs.push(Array.isArray(value) ? value.join(',') : value);
        }
        rimraf2(dest, {
            disableGlob: true
        }, function() {
            var files = [];
            var iterator = new Iterator(srcDir);
            iterator.forEach(function(entry, callback) {
                if (!entry.stats.isFile()) return callback();
                if (!matcher(entry.fullPath)) return callback();
                files.push(entry.fullPath);
                callback();
            }, {
                callbacks: true,
                concurrency: 1024
            }, function(err) {
                if (err) return cb(err);
                var args = [
                    'tsc'
                ].concat(_to_consumable_array$1(files), [
                    '--declaration',
                    '--emitDeclarationOnly',
                    '--outDir',
                    dest
                ], _to_consumable_array$1(tsArgs));
                if (major$1 < 14) args = [
                    nvu$1,
                    'stable'
                ].concat(_to_consumable_array$1(args));
                spawn(args[0], args.slice(1), {
                    cwd: cwd
                }, cb);
            });
        });
    }

    function _array_like_to_array(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
        return arr2;
    }
    function _array_without_holes(arr) {
        if (Array.isArray(arr)) return _array_like_to_array(arr);
    }
    function _iterable_to_array(iter) {
        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
    }
    function _non_iterable_spread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _to_consumable_array(arr) {
        return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
    }
    function _unsupported_iterable_to_array(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _array_like_to_array(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(n);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
    }
    var major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
    var nvu = binPath(resolve.sync('node-version-use/package.json', {
        basedir: __dirname
    }), 'nvu');
    var config = path.resolve(packageRoot(__dirname, 'tsds-build'), 'dist', 'esm', 'rollup.config.mjs');
    function umd(_args, options, cb) {
        var cwd = options.cwd || process.cwd();
        var src = path.resolve(cwd, source(options));
        var dest = path.join(cwd, 'dist', 'umd');
        rimraf2(dest, {
            disableGlob: true
        }, function() {
            var queue = new Queue(1);
            (function() {
                var args = [
                    'rollup',
                    '--config',
                    config,
                    '--input',
                    src
                ];
                if (major < 14) args = [
                    nvu,
                    'stable'
                ].concat(_to_consumable_array(args));
                queue.defer(spawn.bind(null, args[0], args.slice(1), {
                    cwd: cwd
                }));
            })();
            queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
            queue.await(cb);
        });
    }

    function build(args, options, cb) {
        var targs = targets(options);
        var cwd = options.cwd || process.cwd();
        rimraf2(path.join(cwd, 'dist'), {
            disableGlob: true
        }, function() {
            var queue = new Queue(1);
            targs.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
            targs.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
            targs.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
            queue.defer(types.bind(null, args, options));
            queue.await(cb);
        });
    }

    return build;

}));
