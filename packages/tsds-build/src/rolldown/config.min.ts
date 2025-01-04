import path from 'path';
import camelcase from 'lodash.camelcase';
import { type Plugin, defineConfig } from 'rolldown';
import swc from 'ts-swc-rollup-plugin';

import { globals, input, pkg, tsconfig } from '../lib/rollingOptions';

export const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;

import fs from 'fs';
fs.writeFileSync(`${tsconfig.path}.es5`, JSON.stringify(tsconfig.config), 'utf8');

export default defineConfig({
  input,
  output: {
    file: path.join(process.cwd(), 'dist', 'umd', `${pkg.name}.min.cjs`),
    format: 'umd',
    sourcemap: true,
    name: camelcase(pkg.name),
    globals,
    minify: true,
  },
  external: (module) => !!moduleRegEx.test(module),
  plugins: [swc({ tsconfig }) as unknown as Plugin],
  resolve: {
    tsconfigFilename: `${tsconfig.path}.es5`,
  },
});
