module.exports = function packageVersion(name) {
  try {
    const pkg = require(`${name}/package.json`);
    return pkg.version;
  } catch (_err) {
    return '';
  }
};
