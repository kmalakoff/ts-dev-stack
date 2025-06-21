import camelcase from 'lodash.camelcase';
import path from 'path';
import { defineConfig, type RolldownOptions } from 'rolldown';
import swc from 'ts-swc-rollup-plugin';

import { globals, input, pkg, tsconfig } from '../lib/rollingOptions.ts';

export const moduleRegEx = /^[^./]|^\.[^./]|^\.\.[^/]/;

import fs from 'fs';

fs.writeFileSync(`${tsconfig.path}.es5`, JSON.stringify(tsconfig.config), 'utf8');

export default defineConfig({
  input,
  output: {
    file: path.join(process.cwd(), 'dist', 'umd', `${pkg.name}.min.cjs`) as string,
    format: 'umd',
    sourcemap: true,
    name: camelcase(pkg.name) as string,
    globals,
    minify: true,
  },
  external: (module) => !!moduleRegEx.test(module),
  plugins: [swc({ tsconfig })],
  resolve: {
    tsconfigFilename: `${tsconfig.path}.es5`,
  },
}) as RolldownOptions;
