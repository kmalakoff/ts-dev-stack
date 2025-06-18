import { unlink } from 'link-unlink';
import type { CommandCallback, CommandOptions } from 'tsds-lib';
import { installPath } from 'tsds-lib';

export default function command(_args: string[], options: CommandOptions, callback: CommandCallback) {
  unlink(installPath(options), callback);
}
