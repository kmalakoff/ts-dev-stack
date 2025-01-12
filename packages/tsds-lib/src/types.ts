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
