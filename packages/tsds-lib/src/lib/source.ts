import path from 'path';
import config from './config.js';

export default function source(options) {
  const tsds = config(options);
  if (!tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
  return (tsds.source ? tsds.source.split('/') : ['src', 'index.ts']).join(path.sep);
}
