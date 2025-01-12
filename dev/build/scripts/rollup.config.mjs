import path from 'path';
import { defineConfig } from 'rolldown';

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;

export default defineConfig({
  input: './src/index.ts',
  output: {
    file: path.resolve(process.cwd(), 'assets', 'build.cjs'),
    format: 'cjs',
  },
  external: (module) => !!moduleRegEx.test(module),
});
