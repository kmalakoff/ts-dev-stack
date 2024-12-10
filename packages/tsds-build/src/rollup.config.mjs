import fs from 'fs';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import getTS from 'get-tsconfig-compat';
import camelcase from 'lodash.camelcase';
import externals from 'rollup-plugin-node-externals';
import { swc } from 'ts-swc-rollup-plugin';

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const globals = pkg.tsds ? pkg.tsds.globals || {} : {};

const DEPS = ['dependencies', 'optionalDependencies', 'peerDependencies'];
DEPS.forEach((x) => {
  const deps = pkg[x] || {};
  for (const name in deps) {
    if (globals[name] === undefined) console.log(`umd dependency ${name}is missing. Add a "tsds": { "globals": { \"${name}\": "SomeName" } } to your package.json`);
  }
});

const tsconfig = getTS.getTsconfig();
tsconfig.config.compilerOptions = { ...tsconfig.config.compilerOptions, target: 'ES5' };

export default {
  output: [
    {
      file: path.resolve(process.cwd(), 'dist', 'umd', `${pkg.name}.js`),
      format: 'umd',
      sourcemap: true,
      name: camelcase(pkg.name),
      globals,
    },
    {
      file: path.resolve(process.cwd(), 'dist', 'umd', `${pkg.name}.min.js`),
      format: 'umd',
      name: camelcase(pkg.name),
      sourcemap: true,
      plugins: [terser()],
      globals,
    },
  ],
  plugins: [externals({ devDeps: false, builtinsPrefix: 'strip' }), resolve(), swc({ tsconfig })],
};
