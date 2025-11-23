import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/main.ts"],
  noExternal: [/^@gd\//],
  target: "node24",
  minify: true,
});
