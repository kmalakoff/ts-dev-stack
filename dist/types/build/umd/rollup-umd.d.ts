export let output: ({
    file: string;
    format: string;
    sourcemap: boolean;
    name: any;
    globals: any;
    plugins?: undefined;
} | {
    file: string;
    format: string;
    name: any;
    sourcemap: boolean;
    plugins: import("rollup").Plugin[];
    globals: any;
})[];
export let plugins: any[];
