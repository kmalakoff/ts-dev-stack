import fs from 'fs';
import path from 'path';

export default function source(options) {
  const cwd = options.cwd || process.cwd();
  const pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8'));
  if (!pkg.tsds || !pkg.tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');

  return (pkg.tsds && pkg.tsds.source ? pkg.tsds.source.split('/') : ['src', 'index.ts']).join(path.sep);
}
