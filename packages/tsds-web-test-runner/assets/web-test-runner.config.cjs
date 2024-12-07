const { playwrightLauncher } = require('@web/test-runner-playwright');
const { importMapsPlugin } = require('@web/dev-server-import-maps');
const { esbuildPlugin } = require('@web/dev-server-esbuild');

function version(name) {
  try {
    const pkg = require(`${name}/package.json`);
    return pkg.version;
  } catch (_err) {
    return '';
  }
}

module.exports = {
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            assert: `https://esm.sh/assert@${version('assert')}`,
            react: `https://esm.sh/react@${version('react')}?dev`,
            'react-dom': `https://esm.sh/react-dom@${version('react-dom')}?dev`,
            'react-dom/client': `https://esm.sh/react-dom@${version('react-dom')}/client.js?dev`,
            'react-native-web': `https://esm.sh/react-native-web@${version('react-native-web')}`,
          },
        },
      },
    }),
    esbuildPlugin({
      loaders: { '.ts': 'ts', '.tsx': 'tsx', '.jsx': 'jsx', '.cjs': 'js', '.mjs': 'js' },
      jsxFactory: 'React.createElement',
      jsxFragment: 'Fragment',
    }),
  ],
};
