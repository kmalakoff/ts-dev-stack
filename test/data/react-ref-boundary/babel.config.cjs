/* eslint-disable @typescript-eslint/no-var-requires */
const babelConfig = require('./node_modules/ts-dev-stack/.babelrc.json');
const testConfig = {
  presets: ['module:metro-react-native-babel-preset'],
};
module.exports = process.env.BABEL_ENV === 'test' ? testConfig : babelConfig;
