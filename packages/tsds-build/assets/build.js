var build = require('./tsds-build.js')

build(null, {}, (err) => { 
  !err || console.error(err);
})

