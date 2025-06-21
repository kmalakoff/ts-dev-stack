import resolve from '@rollup/plugin-node-resolve';
import camelcase from 'lodash.camelcase';
import path from 'path';
import externals from 'rollup-plugin-node-externals';
import swc from 'ts-swc-rollup-plugin';

import { globals, input, pkg, tsconfig } from '../lib/rollingOptions.ts';

export default {
  input,
  output: {
    file: path.join(process.cwd(), 'dist', 'umd', `${pkg.name}.cjs`),
    format: 'umd',
    sourcemap: true,
    name: camelcase(pkg.name),
    globals,
  },
  plugins: [externals({ devDeps: false, builtinsPrefix: 'strip' }), resolve(), swc({ tsconfig })],
};
