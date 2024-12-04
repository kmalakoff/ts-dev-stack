import fs from 'fs';
import path from 'path';
export default function installPath(options) {
    options = options || {};
    if (options.installPath) return options.installPath;
    const cwd = options.cwd || process.cwd();
    const pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8'));
    return path.resolve(cwd, 'node_modules', pkg.name);
}
