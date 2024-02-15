module.exports = {
  build: require('./build'),
  coverage: require('./test/c8'),
  deploy: require('./deploy'),
  docs: require('./docs/ndex'),
  format: require('./quality/format'),
  link: require('./link'),
  test: require('./test'),
  'test:node': require('./test/mocha'),
  'test:browser': require('./test/karma'),
  unlink: require('./unlink'),
  version: require('./deploy/version'),
};
