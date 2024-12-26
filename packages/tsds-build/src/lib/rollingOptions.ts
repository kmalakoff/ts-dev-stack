import fs from 'fs';
import path from 'path';
import * as getTS from 'get-tsconfig-compat';
import camelcase from 'lodash.camelcase';

export const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
export const source = pkg.tsds ? pkg.tsds.source || 'src/index.ts' : 'src/index.ts';
export const input = path.join.apply(null, [process.cwd(), ...source.split('/')]);
export const name = camelcase(pkg.name);
export const globals = pkg.tsds ? pkg.tsds.globals || {} : {};

const DEPS = ['dependencies', 'optionalDependencies', 'peerDependencies'];
DEPS.forEach((x) => {
  const deps = pkg[x] || {};
  for (const name in deps) {
    if (globals[name] === undefined) console.log(`umd dependency ${name}is missing. Add a "tsds": { "globals": { \"${name}\": "SomeName" } } to your package.json`);
  }
});

export const tsconfig = getTS.getTsconfig();
tsconfig.config.compilerOptions = { ...tsconfig.config.compilerOptions, target: 'ES5' };
