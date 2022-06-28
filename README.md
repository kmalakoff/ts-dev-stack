## ts-dev-stack

Development stack for TypeScript libraries

For an example, check out [parser-multipart](https://github.com/kmalakoff/parser-multipart)

# Example 1: CLI

```
# build dist and docs
$ tsds build

# build dist
$ tsds build:js

# build docs
$ tsds build:docs

# run coverage tests (default on "test/unit/*.test.*" only) using c8
$ tsds coverage:node

# deploy library using np
$ tsds deploy

# format library using prettier
$ tsds format

# lint library using eslint
$ tsds lint

# run tests on current version of node and browser
$ tsds test

# run tests on all versions of node in engines
$ tsds test:engines

# run tests on current version of node
$ tsds test:engines

# run tests on browser only
$ tsds test:browser
```
