import fs from 'fs';
import path from 'path';
export default function config(options) {
    options = options || {};
    const cwd = options.cwd || process.cwd();
    return options.config || JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8')).tsds || {};
}
