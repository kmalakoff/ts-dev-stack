import type { SpawnOptions } from 'cross-spawn-cb';

export interface Package extends JSON {
  name: string;
  private?: boolean;
  version?: string;
  scripts?: Record<string, string>;
  tsds?: Config;
}

export interface Config {
  source?: string;
  targets?: string[];
  commands?: JSON;
  globals?: Record<string, string>;
}

export interface CommandOptions extends SpawnOptions {
  cwd?: string | URL;
  config?: Config;
  package?: Package;
  installPath?: string;
}

export type CommandCallback = (error?: Error) => undefined;

export type Wrapper = (version: string, ...args: unknown[]) => undefined;
export type WrapperCallback = (error?: Error, result?: unknown) => undefined;
