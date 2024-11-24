import path from 'node:path';
import getTS from 'get-tsconfig-compat';
import { createMatcher, transformSync } from 'ts-swc-loaders';

const config = getTS.getTsconfig(path.resolve(process.cwd(), 'tsconfig.json'));
config.config.compilerOptions.target = 'ES5';
const matcher = createMatcher(config);

export default function swcPlugin() {
  return {
    name: 'swc',
    transform(contents, filename) {
      if (!matcher(filename)) return null;
      return transformSync(contents, filename, config);
    },
  };
}
