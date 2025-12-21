export const BINARY_MIME_WHITELIST = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",

  "application/pdf",

  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
]);

export const TEXT_MIME_WHITELIST = new Set<string>([
  "application/json",
  "application/toml",

  "text/plain",
  "text/javascript",
  "text/jsx",
  "text/yaml",
  "text/markdown",
  "text/css",
]);

export const TEXT_CUSTOM_EXTENSION_WHITE_LIST = new Set<string>(["tsx"]);
