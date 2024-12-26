import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import camelcase from 'lodash.camelcase';
import externals from 'rollup-plugin-node-externals';
import swc from 'ts-swc-rollup-plugin';

import { globals, input, pkg, tsconfig } from '../lib/rollingOptions.js';

export default {
  input,
  output: {
    file: path.resolve(process.cwd(), 'dist', 'umd', `${pkg.name}.js`),
    format: 'umd',
    sourcemap: true,
    name: camelcase(pkg.name),
    globals,
  },
  plugins: [externals({ devDeps: false, builtinsPrefix: 'strip' }), resolve(), swc({ tsconfig })],
};
