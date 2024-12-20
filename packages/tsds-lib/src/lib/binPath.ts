import fs from 'fs';
import path from 'path';

export default function binPath(packagePath: string, binName?: string) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (!pkg) throw new Error(`Module binary package not found. Module: ${packagePath}`);

  // one of the bin entries
  if (binName) {
    if (typeof pkg.bin[binName] !== 'string') throw new Error(`Module binary not found. Module: ${packagePath}. Binary: ${binName}`);
    return path.resolve.apply(null, [path.dirname(packagePath), ...pkg.bin[binName].split('/')]);
  }

  // the bin entry itself
  if (typeof pkg.bin !== 'string') throw new Error(`Module binary expecting a path. Module: ${packagePath}`);
  return path.resolve.apply(null, [path.dirname(packagePath), ...pkg.bin.split('/')]);
}
