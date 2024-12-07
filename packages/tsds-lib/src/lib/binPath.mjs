import fs from 'fs';
import path from 'path';

export default function binPath(packagePath, binName) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!pkg || !pkg.bin[binName]) throw new Error(`Module binary not found. Module: ${packagePath}. Binary: ${binName}`);
  return path.resolve.apply(null, [path.dirname(packagePath)].concat(pkg.bin[binName].split('/')));
}
