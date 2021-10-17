import blobToString from "./blobToString";

export interface HeadersObject {
  [key: string]: string;
}

// https://github.com/node-fetch/node-fetch/blob/main/%40types/index.d.ts
export type HeadersInit =
  | Headers
  | HeadersObject
  | Record<string, string>
  | Iterable<readonly [string, string]>
  | Iterable<Iterable<string>>;
const hasHeaders = typeof Headers !== "undefined";

export type BodyInit = Blob | Buffer | URLSearchParams | string;
const hasBlob = typeof Blob !== "undefined";
const hasBuffer = typeof Buffer !== "undefined";
const hasURLSearchParams = typeof URLSearchParams !== "undefined";

// export type RequestRedirect = 'error' | 'follow' | 'manual';
export interface RequestInit {
  body?: BodyInit | null;
  headers?: HeadersInit;
  method?: string;
  // redirect?: RequestRedirect;
}

export type RequestInfo = string | Request;
export interface Request {
  readonly headers: Headers | HeadersObject;
  readonly method: string;
  // readonly redirect: RequestRedirect;
  readonly url: string;
}

function isRequest(object) {
  return typeof object === "object";
}

/**
 * Generate an http message string using the fetch API
 *
 * @param input Fetch input
 * @param init Fetch init
 * @returns The http message string
 */
export default function fetchHttpMessage(input: RequestInfo, init?: RequestInit): string {
  if (input === undefined) throw new Error("Input is expected");
  if (init === undefined) init = {};

  let url;
  if (isRequest(input)) url = (input as Request).url;
  else {
    url = input as string;
    input = {} as Request;
  }

  let method = init.method || (input as Request).method || "GET";
  method = method.toUpperCase();
  const lines = [`${method} ${url} HTTP/1.1`];

  const headers = init.headers || (input as Request).headers;
  if (headers !== undefined) {
    /* c8 ignore start */
    if (hasHeaders && headers instanceof Headers) {
      for (const pair of (headers as Headers).entries()) lines.push(`${pair[0]}: ${pair[1]}`);
    } else {
      /* c8 ignore stop */
      for (const key in headers as HeadersObject) lines.push(`${key}: ${headers[key]}`);
    }
  }

  const body = init.body;
  if (body !== undefined) {
    if (~["GET", "HEAD"].indexOf(method)) throw new Error(`Option body not valid with method ${method}`);
    /* c8 ignore start */
    if (hasBlob && body instanceof Blob) {
      lines.push("");
      lines.push(blobToString(body));
    } else if (
      /* c8 ignore stop */
      typeof body === "string" ||
      body instanceof String ||
      /* c8 ignore start */
      (hasBuffer && body instanceof Buffer) ||
      (hasURLSearchParams && body instanceof URLSearchParams)
      /* c8 ignore stop */
    ) {
      lines.push("");
      lines.push(body.toString());
    } else throw new Error("Option body should be convertible to a string");
  }
  return lines.join("\r\n");
}
