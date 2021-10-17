/// <reference types="node" />
export interface HeadersObject {
    [key: string]: string;
}
export declare type HeadersInit = Headers | HeadersObject | Record<string, string> | Iterable<readonly [string, string]> | Iterable<Iterable<string>>;
export declare type BodyInit = Blob | Buffer | URLSearchParams | string;
export interface RequestInit {
    body?: BodyInit | null;
    headers?: HeadersInit;
    method?: string;
}
export declare type RequestInfo = string | Request;
export interface Request {
    readonly headers: Headers | HeadersObject;
    readonly method: string;
    readonly url: string;
}
/**
 * Generate an http message string using the fetch API
 *
 * @param input Fetch input
 * @param init Fetch init
 * @returns The http message string
 */
export default function fetchHttpMessage(input: RequestInfo, init?: RequestInit): string;
