import fs from 'fs';
export default (()=>{
    // make it commonjs
    const packageFile = require.resolve('yargs/package.json');
    const contents = fs.readFileSync(packageFile, 'utf8');
    const pkg = JSON.parse(contents);
    pkg.type = 'commonjs';
    fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2), 'utf8');
});
