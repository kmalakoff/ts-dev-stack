import fs from 'fs';
import path from 'path';

export default function installPath(options) {
  options = options || {};
  if (options.installPath) return options.installPath;
  const cwd: string = (options.cwd as string) || process.cwd();
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  return path.join(cwd, 'node_modules', pkg.name);
}
