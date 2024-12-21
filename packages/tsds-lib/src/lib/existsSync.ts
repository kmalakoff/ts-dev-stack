import accessSync from 'fs-access-sync-compat';

export default function path(path) {
  try {
    accessSync(path);
    return true;
  } catch (_err) {
    return false;
  }
}
