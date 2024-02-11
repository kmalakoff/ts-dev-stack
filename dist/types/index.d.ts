declare const _exports: {
    build: (args: any, options: any, cb: any) => void;
    coverage: (_args: any, _options: any, cb: any) => void;
    deploy: {
        (args: any, options: any, cb: any): void;
        options: {
            alias: {
                'no-publish': string;
                preview: string;
                yarn: string;
            };
        };
    };
    docs: (_args: any, options: any, cb: any) => void;
    format: (_args: any, options: any, cb: any) => void;
    link: (_args: any, options: any, cb: any) => any;
    test: (args: any, options: any, cb: any) => void;
    'test:node': {
        (args: any, options: any, cb: any): void;
        options: {
            alias: {
                temp: string;
            };
        };
    };
    'test:browser': (args: any, options: any, cb: any) => void;
    unlink: (_args: any, options: any, cb: any) => any;
    version: (_args: any, _options: any, cb: any) => void;
};
export = _exports;
