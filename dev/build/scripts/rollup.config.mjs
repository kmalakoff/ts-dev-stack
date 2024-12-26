import path from 'path';
import { defineConfig } from 'rolldown';

export const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;

export default defineConfig({
  input: './src/tsds-build.ts',
  output: {
    file: path.resolve(process.cwd(), 'assets', 'tsds-build.js'),
    format: 'cjs',
  },
  external: (module) => !moduleRegEx.test(module) ? false : !['tsds-lib', 'tsds-build'].includes(module),
  resolve: {
    tsconfigFilename: path.join(process.cwd(), 'tsconfig.json'),
  },
});
