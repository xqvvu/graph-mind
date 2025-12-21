import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { isValidFile } from "@/lib/file-type";

describe("isValidFile", () => {
  describe("Valid text files", () => {
    it("should detect YAML as text/plain", async () => {
      const filePath = "/Users/chuanhu9/devs/graph-mind/pnpm-workspace.yaml";
      const file = fs.readFileSync(filePath);
      const fileType = await isValidFile({ file, from: "buffer", filename: filePath });

      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.ext).toBe("yaml");
        expect(fileType.mime).toBe("text/plain");
      }
    });

    it("should detect JSON as text/plain", async () => {
      const jsonContent = JSON.stringify({ test: true });
      const file = new TextEncoder().encode(jsonContent);
      const fileType = await isValidFile({
        file,
        from: "buffer",
        filename: "test.json",
      });

      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.mime).toBe("text/plain");
      }
    });

    it("should handle custom text extensions (tsx)", async () => {
      const tsxContent = `
import React from 'react';
const Component = () => <div>Hello</div>;
export default Component;
      `.trim();
      const file = new TextEncoder().encode(tsxContent);
      const fileType = await isValidFile({
        file,
        from: "buffer",
        filename: "component.tsx",
      });

      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.ext).toBe("tsx");
        expect(fileType.mime).toBe("text/plain");
      }
    });

    it("should handle unknown content with text extension", async () => {
      const randomBytes = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const fileType = await isValidFile({
        file: randomBytes,
        from: "buffer",
        filename: "unknown.txt",
      });

      // Should fall back to filename-based detection
      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.mime).toBe("text/plain");
        expect(fileType.ext).toBe("txt");
      }
    });
  });

  describe("Valid binary files", () => {
    it("should detect PNG as valid", async () => {
      // Complete PNG header with IHDR chunk
      const pngHeader = new Uint8Array([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a, // PNG signature
        0x00,
        0x00,
        0x00,
        0x0d, // IHDR chunk length
        0x49,
        0x48,
        0x44,
        0x52, // IHDR
        0x00,
        0x00,
        0x00,
        0x01, // Width: 1
        0x00,
        0x00,
        0x00,
        0x01, // Height: 1
        0x08,
        0x02,
        0x00,
        0x00,
        0x00, // Bit depth, color type, compression, filter, interlace
        0x90,
        0x77,
        0x53,
        0xde, // CRC
      ]);
      const fileType = await isValidFile({
        file: pngHeader,
        from: "buffer",
        filename: "test.png",
      });

      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.mime).toBe("image/png");
        expect(fileType.ext).toBe("png");
      }
    });

    it("should detect PDF as valid", async () => {
      // PDF header bytes
      const pdfHeader = new TextEncoder().encode("%PDF-1.4");
      const fileType = await isValidFile({
        file: pdfHeader,
        from: "buffer",
        filename: "test.pdf",
      });

      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.mime).toBe("application/pdf");
        expect(fileType.ext).toBe("pdf");
      }
    });
  });

  describe("Invalid files", () => {
    it("should reject executables", async () => {
      // PE header (Windows executable)
      const peHeader = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const fileType = await isValidFile({
        file: peHeader,
        from: "buffer",
        filename: "test.exe",
      });

      expect(fileType.ok).toBe(false);
    });

    it("should reject unknown file types with unknown extensions", async () => {
      const randomBytes = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const fileType = await isValidFile({
        file: randomBytes,
        from: "buffer",
        filename: "test.unknown",
      });

      expect(fileType.ok).toBe(false);
    });

    it("should reject files without extension", async () => {
      const content = new TextEncoder().encode("Hello, world!");
      const fileType = await isValidFile({
        file: content,
        from: "buffer",
        filename: "no_extension",
      });

      expect(fileType.ok).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty files", async () => {
      const emptyFile = new Uint8Array([]);
      const fileType = await isValidFile({
        file: emptyFile,
        from: "buffer",
        filename: "empty.txt",
      });

      // Empty file should fall back to filename-based detection
      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.mime).toBe("text/plain");
      }
    });

    it("should work with stream input", async () => {
      const content = "Hello, world!";
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(content));
          controller.close();
        },
      });

      const fileType = await isValidFile({
        file: stream,
        from: "stream",
        filename: "test.txt",
      });

      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.mime).toBe("text/plain");
      }
    });

    it("should handle special case for .ts extension", async () => {
      const randomBytes = new Uint8Array([0x01, 0x02, 0x03, 0x04]);
      const fileType = await isValidFile({
        file: randomBytes,
        from: "buffer",
        filename: "test.ts",
      });

      // .ts extension should resolve to text/plain
      expect(fileType.ok).toBe(true);
      if (fileType.ok) {
        expect(fileType.mime).toBe("text/plain");
        expect(fileType.ext).toBe("ts");
      }
    });
  });
});
