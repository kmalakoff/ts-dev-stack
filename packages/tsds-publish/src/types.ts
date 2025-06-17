import type { CommandOptions as CommandOptionsBase } from 'tsds-lib';

export interface Package {
  name: string;
  private?: boolean;
  version?: string;
  scripts?: { [key: string]: string };
}

export interface CommandOptionsPublish {
  package?: Package;
  cwd?: string;
}

export type CommandOptions = CommandOptionsPublish | CommandOptionsBase;
