## ts-dev-stack

Development stack for TypeScript libraries

For an example, check out [parser-multipart](https://github.com/kmalakoff/parser-multipart)

```
# build
$ npm run build

# deploy library using np
$ tsds deploy --yolo

# format library using prettier
$ tsds validate

# run tests on current version of node
$ tsds test:node

# run tests on browser only
$ tsds test:browser --config wtr.config.mjs
```
