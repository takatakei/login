import base64urlLib from "base64url";
import keccakLib from "keccak";

export const keccak = keccakLib;

export type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";

export const base64url = base64urlLib;

export function base64toJSON(b64str: string): Record<string, unknown> {
  return JSON.parse(base64url.decode(b64str));
}

export function jsonToBase64(json: Record<string, unknown>): string {
  return base64url.encode(JSON.stringify(json));
}
