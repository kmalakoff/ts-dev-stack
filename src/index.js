module.exports = {
  build: require('./build'),
  coverage: require('./test/c8'),
  deploy: require('./deploy'),
  docs: require('./docs'),
  format: require('./quality/format'),
  link: require('./link'),
  predeploy: require('./deploy/pre'),
  test: require('./test'),
  'test:node': require('./test/mocha'),
  'test:browser': require('./test/karma'),
  unlink: require('./unlink'),
  version: require('./deploy/version'),
};
