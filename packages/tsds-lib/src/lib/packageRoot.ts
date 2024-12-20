import path from 'path';

export default function packageRoot(dir, packageName) {
  if (path.basename(dir) === packageName) return dir;
  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error(`${packageName} not found`);
  return packageRoot(nextDir, packageName);
}
