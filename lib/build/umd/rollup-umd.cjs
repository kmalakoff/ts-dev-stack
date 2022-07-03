var externals = require('rollup-plugin-node-externals');
var resolve = require('@rollup/plugin-node-resolve').default;
var terser = require('rollup-plugin-terser');
var swc = require('./swc');
var camelcase = require('lodash.camelcase');
var assign = require('just-extend');

var path = require('path');
var fs = require('fs');
var pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

var DEPS = ['', 'dependencies', 'optionalDependencies', 'peerDependencies'];
var deps = assign.apply(
  null,
  DEPS.map((x) => pkg[x] || {})
);
var globals = pkg.tsds ? pkg.tsds.globals || {} : {};
Object.keys(deps).forEach((x) => {
  if (globals[x] === undefined) console.log(`umd dependency ${x} is missing. Add a "tsds": { "globals": { "${x}": "SomeName" } } to your package.json`);
});

module.exports = {
  output: [
    {
      file: path.resolve(process.cwd(), 'dist', 'umd', `${pkg.name}.js`),
      format: 'umd',
      sourcemap: true,
      name: camelcase(pkg.name),
      globals: globals,
    },
    {
      file: path.resolve(process.cwd(), 'dist', 'umd', `${pkg.name}.min.js`),
      format: 'umd',
      name: camelcase(pkg.name),
      sourcemap: true,
      plugins: [terser.terser()],
      globals: globals,
    },
  ],
  plugins: [externals({ devDeps: false }), resolve(), swc()],
};
