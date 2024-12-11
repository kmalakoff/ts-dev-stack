import resolve from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals';
import swc from 'ts-swc-rollup-plugin';

import getTS from 'get-tsconfig-compat';

const tsconfig = getTS.getTsconfig();
tsconfig.config.compilerOptions = { ...tsconfig.config.compilerOptions, target: 'ES5' };

export default {
  output: {
    format: 'umd',
    name: 'tsdsBuild',
  },
  plugins: [externals({ deps: false, devDeps: false, builtinsPrefix: 'strip' }), resolve({ resolveOnly: ['tsds-lib'] }), swc({ tsconfig })],
};
