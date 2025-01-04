import fs from 'fs';
import path from 'path';

export interface ConfigOptions {
  cwd?: string;
  config?: JSON;
}

const defaults = {
  source: 'src/index.ts',
  targets: ['cjs', 'esm'],
  commands: {
    build: 'tsds-build',
    coverage: 'tsds-c8',
    publish: './commands/publish.cjs',
    docs: 'tsds-typedoc',
    format: 'tsds-biome',
    link: './commands/link.cjs',
    'test:node': 'tsds-mocha',
    'test:browser': 'tsds-web-test-runner',
    unlink: './commands/unlink.cjs',
    validate: './commands/validate.cjs',
    version: './commands/version.cjs',
  },
};

export default function config(options: ConfigOptions = {}) {
  if (options.config) return options.config;
  const cwd = options.cwd || process.cwd();
  const tsds = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).tsds || {};
  if (!tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
  return { ...defaults, ...tsds };
}
