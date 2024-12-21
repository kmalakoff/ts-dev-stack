import accessSync from 'fs-access-sync-compat';

export default function existsSync(path) {
  try {
    accessSync(path);
    return true;
  } catch (_err) {
    return false;
  }
}
