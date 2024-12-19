declare namespace _default {
    let output: ({
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
        plugins: import("rollup").Plugin<any>[];
        globals: any;
    })[];
    let plugins: import("rollup").Plugin<any>[];
}
export default _default;
