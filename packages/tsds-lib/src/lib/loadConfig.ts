import fs from 'fs';
import path from 'path';

import type { CommandOptions, Config, Package } from '../types.ts';

export default function loadConfig(options: CommandOptions = {}): Config {
  if (options.config) return options.config;
  const cwd: string = (options.cwd as string) || process.cwd();
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')) as Package;
    options.config = pkg.tsds;
    return options.config;
  } catch (_) {
    return null;
  }
}
