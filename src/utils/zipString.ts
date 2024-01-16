import zlib from "zlib";

export function compressString(str: string) {
  return zlib.gzipSync(str).toString("base64");
}

export function decompressString(compressedStr: string) {
  return zlib.gunzipSync(Buffer.from(compressedStr, "base64")).toString();
}
