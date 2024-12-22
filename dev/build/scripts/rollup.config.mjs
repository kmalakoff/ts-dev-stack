import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals';
import swc from 'ts-swc-rollup-plugin';

export default {
  output: {
    format: 'umd',
    name: 'tsdsBuild',
  },
  plugins: [commonjs(), externals({ deps: false, devDeps: false, builtinsPrefix: 'strip' }), resolve({ resolveOnly: ['tsds-build', 'tsds-lib'] }), swc()],
};
