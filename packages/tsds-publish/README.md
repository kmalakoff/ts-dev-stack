## tsds-publish

Development stack for TypeScript libraries

For an example, check out [parser-multipart](https://github.com/kmalakoff/parser-multipart)

# Example 1: CLI

```
# build
$ npm run build

# run coverage tests (default on "test/**/*.test.*" only) using c8
$ tsds coverage

# deploy library using np
$ tsds deploy

# format library using prettier
$ tsds format

# run tests on current version of node
$ tsds test:node

# run tests on browser only
$ tsds test:browser
```
