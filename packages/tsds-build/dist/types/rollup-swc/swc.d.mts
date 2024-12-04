export default function swcPlugin(): {
    name: string;
    transform(contents: any, filename: any): any;
};
