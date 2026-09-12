# ts-dev-stack

Opinionated build, test, format, documentation, versioning, and publishing
commands for TypeScript libraries. Use it when you want one `tsds` CLI to run a
consistent library toolchain.

## Install

Install the CLI and its shared TypeScript and Biome presets:

```bash
npm install --save-dev ts-dev-stack tsds-config
```

Extend the TypeScript preset in `tsconfig.json`:

```json
{
  "extends": "tsds-config/tsconfig.json"
}
```

## Use

Add the commands your project needs to `package.json`:

```json
{
  "scripts": {
    "build": "tsds build",
    "format": "tsds format",
    "test": "tsds test:node --no-timeouts"
  }
}
```

Then run them through npm:

```bash
npm run build
npm test
```

The CLI also provides `coverage`, `docs`, `install`, `link`, `publish`,
`test:browser`, `unlink`, `validate`, and `version`. Run `npx tsds --help` for
the current command list. Command packages are installed on first use when they
are not already available, so the first run may access the npm registry.

Projects can select build targets and override or disable commands with the
`tsds` field in `package.json`. See
[parser-multipart](https://github.com/kmalakoff/parser-multipart) for a working
project configuration.
