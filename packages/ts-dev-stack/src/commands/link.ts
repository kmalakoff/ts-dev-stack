import { link } from 'link-unlink';
import { installPath } from 'tsds-lib';

import type { CommandCallback, CommandOptions } from 'tsds-lib';

export default function command(_args: string[], options: CommandOptions, callback: CommandCallback) {
  const cwd: string = (options.cwd as string) || process.cwd();
  link(cwd, installPath(options), callback);
}
