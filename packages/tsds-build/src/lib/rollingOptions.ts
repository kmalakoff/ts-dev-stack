import fs from 'fs';
import camelcase from 'lodash.camelcase';
import path from 'path';
import loadConfigSync from 'read-tsconfig-sync';

import type { Package } from 'tsds-lib';

export const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')) as Package;
export const source = (pkg.tsds ? pkg.tsds.source || 'src/index.ts' : 'src/index.ts') as string;
export const input = path.join.apply(null, [process.cwd(), ...source.split('/')]) as string;
export const name = camelcase(pkg.name) as string;
const globals_ = pkg.tsds ? pkg.tsds.globals || {} : {};
export const globals = globals_ as Record<string, string>;

const DEPS = ['dependencies', 'optionalDependencies', 'peerDependencies'];
DEPS.forEach((x) => {
  const deps = pkg[x] || {};
  for (const name in deps) {
    if (globals[name] === undefined) console.log(`umd dependency ${name}is missing. Add a "tsds": { "globals": { "${name}": "SomeName" } } to your package.json`);
  }
});

export const tsconfig = loadConfigSync(process.cwd());
tsconfig.config.compilerOptions = { ...tsconfig.config.compilerOptions, target: 'es5' };
