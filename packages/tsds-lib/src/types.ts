import type { SpawnOptions } from 'cross-spawn-cb';

export interface Config {
  source?: string;
  targets?: string[];
  commands?: JSON;
}

export interface ConfigOptions {
  cwd?: string;
  config?: Config;
  package?: JSON;
}

export type CommandOptions = ConfigOptions | SpawnOptions;
export type CommandCallback = (error?: Error) => undefined;
