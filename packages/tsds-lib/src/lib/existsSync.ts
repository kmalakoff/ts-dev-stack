import fs from 'fs';

function existsSyncPolyfill(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (_) {
    return false;
  }
}

export default fs.accessSync ? existsSyncPolyfill : fs.existsSync;
