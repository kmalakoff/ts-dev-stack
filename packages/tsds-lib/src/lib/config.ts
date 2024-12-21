import fs from 'fs';
import path from 'path';

// @ts-ignore
import process from './process.cjs';

export interface ConfigOptions {
  cwd?: string;
  config?: JSON;
}

export default function config(options: ConfigOptions = {}) {
  const cwd = options.cwd || process.cwd();
  return options.config || JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8')).tsds || {};
}
