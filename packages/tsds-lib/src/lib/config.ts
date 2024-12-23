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
    publish: './commands/publish.js',
    prepublish: './commands/prepublish.js',
    docs: 'tsds-typedoc',
    format: 'tsds-biome',
    link: './commands/link.js',
    'test:node': 'tsds-mocha',
    'test:browser': 'tsds-web-test-runner',
    unlink: './commands/unlink.js',
    version: './commands/version.js',
  },
};

export default function config(options: ConfigOptions = {}) {
  if (options.config) return options.config;
  const cwd = options.cwd || process.cwd();
  const tsds = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8')).tsds || {};
  if (!tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
  return { ...defaults, ...tsds };
}
