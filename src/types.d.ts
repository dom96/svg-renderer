declare module '*.wasm' {
  const wasm: WebAssembly.Module;
  export default wasm;
}

declare module '*.ttf' {
  const raw: ArrayBuffer;
  export default raw;
}

// Cloudflare Workers Cache API types
interface CacheStorage {
  default: Cache;
}
