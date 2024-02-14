const externals = require('rollup-plugin-node-externals');
const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('rollup-plugin-terser');
const swc = require('./swc');
const camelcase = require('lodash.camelcase');
const assign = require('just-extend');

const path = require('path');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

const DEPS = ['', 'dependencies', 'optionalDependencies', 'peerDependencies'];
const deps = assign.apply(
  null,
  DEPS.map((x) => pkg[x] || {})
);
const globals = pkg.tsds ? pkg.tsds.globals || {} : {};

Object.keys(deps).forEach((x) => {
  if (globals[x] === undefined) console.log(`umd dependency ${x}is missing. Add a "tsds": { "globals": { "\${x}": "SomeName" } } to your package.json`);
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
