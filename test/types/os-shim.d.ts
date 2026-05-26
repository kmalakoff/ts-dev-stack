declare module 'os-shim' {
  const osShim: { tmpdir(): string; tmpDir(): string };
  export = osShim;
}
