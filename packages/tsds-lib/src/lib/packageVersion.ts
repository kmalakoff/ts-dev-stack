import fs from 'fs';
import resolve from 'resolve';

export default function packageVersion(name) {
  try {
    const packagePath = resolve.sync(`${name}/package.json`);
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return pkg.version;
  } catch (_err) {
    return '';
  }
}
