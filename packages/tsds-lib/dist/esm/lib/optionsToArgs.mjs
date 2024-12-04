export default function optionsToArgs(options) {
    let args = [];
    for(const key in options){
        if (key === '_') continue;
        if (options[key] === true) args.push(`--${key}`);
        else if (options[key] === false) args.push(`--no-${key}`);
        else args = args.concat([
            `--${key}`,
            options[key]
        ]);
    }
    return args;
}
