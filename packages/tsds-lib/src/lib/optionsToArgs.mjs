export default function optionsToArgs(options) {
  const args = [];
  for (const key in options) {
    if (key === '_') continue;
    if (options[key] === true) args.push(`--${key}`);
    else if (options[key] === false) args.push(`--no-${key}`);
    else Array.prototype.push.apply(args, [`--${key}`, options[key]]);
  }
  return args;
}
