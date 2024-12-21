import path from 'path';
import existsSync from './existsSync.js';

export default function packageRoot(dir) {
  if (existsSync(path.join(dir, 'package.json'))) return dir;
  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error('Package root not found');
  return packageRoot(nextDir);
}
