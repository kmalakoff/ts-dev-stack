import fs from 'fs';
import path from 'path';

import type { Config, ConfigOptions } from '../types.js';

export default function loadConfig(options: ConfigOptions = {}): Config {
  if (options.config) return options.config;
  const cwd: string = (options.cwd as string) || process.cwd();
  try {
    options.config = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).tsds;
    return options.config as Config;
  } catch (_) {
    return null;
  }
}
