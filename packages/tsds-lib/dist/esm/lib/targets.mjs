import path from 'path';
import fs from 'fs';
export default function targets(options) {
    const cwd = options.cwd || process.cwd();
    const pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8'));
    if (pkg.tsds && pkg.tsds.targets) return pkg.tsds.targets;
    return [
        'cjs',
        'esm',
        'umd'
    ];
}
