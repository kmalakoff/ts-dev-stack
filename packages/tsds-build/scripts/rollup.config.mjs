import getTS from 'get-tsconfig-compat';
import { swc } from 'ts-swc-rollup-plugin';

const tsconfig = getTS.getTsconfig();
tsconfig.config.compilerOptions = { ...tsconfig.config.compilerOptions, target: 'ES5' };

export default {
  output: {
    format: 'umd',
    name: 'tsdsBuild',
  },
  plugins: [swc({ tsconfig })],
};
