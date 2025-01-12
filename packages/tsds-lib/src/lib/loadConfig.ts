import fs from 'fs';
import path from 'path';

export interface ConfigOptions {
  cwd?: string;
  config?: JSON;
}

export default function loadConfig(options: ConfigOptions = {}) {
  if (options.config) return options.config;
  const cwd = options.cwd || process.cwd();
  return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).tsds;
}
