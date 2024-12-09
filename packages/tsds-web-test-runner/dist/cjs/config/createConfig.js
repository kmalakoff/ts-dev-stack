/// <reference lib="dom" />
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return createConfig;
    }
});
var _devserveresbuild = require("@web/dev-server-esbuild");
var _devserverimportmaps = require("@web/dev-server-import-maps");
var _testrunnerplaywright = require("@web/test-runner-playwright");
var _webpackmerge = require("webpack-merge");
function createConfig() {
    var mergeConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var config = {
        nodeResolve: true,
        browsers: [
            (0, _testrunnerplaywright.playwrightLauncher)({
                product: 'chromium'
            }),
            (0, _testrunnerplaywright.playwrightLauncher)({
                product: 'firefox'
            }),
            (0, _testrunnerplaywright.playwrightLauncher)({
                product: 'webkit'
            })
        ],
        plugins: [
            (0, _devserverimportmaps.importMapsPlugin)({
                inject: {
                    importMap: {
                        imports: {
                            assert: 'https://esm.sh/stable/assert'
                        }
                    }
                }
            }),
            (0, _devserveresbuild.esbuildPlugin)({
                loaders: {
                    '.ts': 'ts',
                    '.tsx': 'tsx',
                    '.jsx': 'jsx',
                    '.cjs': 'js',
                    '.mjs': 'js'
                },
                jsxFactory: 'React.createElement',
                jsxFragment: 'Fragment'
            })
        ]
    };
    return (0, _webpackmerge.merge)(mergeConfig, config);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }