#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isNodeModules(name) {
  return name === "node_modules";
}

function shouldSkip(name) {
  const skippedDirs = new Set([
    ".git",
    ".cursor",
    ".vscode",
    ".idea",
    ".DS_Store",
    "openspec",
  ]);
  return skippedDirs.has(name);
}

async function removeDirectory(dirPath) {
  console.info(`🧹 Start delete ${dirPath}`);
  await fs.rm(dirPath, { recursive: true, force: true });
  console.info(`⭕ Deleted ${dirPath}`);
}

async function scanAndClean(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const promises = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = path.join(dir, entry.name);

      if (isNodeModules(entry.name)) {
        promises.push(removeDirectory(fullPath));
      } else if (!shouldSkip(entry.name)) {
        promises.push(scanAndClean(fullPath));
      }
    }

    await Promise.all(promises);
  } catch (error) {
    // Ignore errors for paths we can't access or that don't exist anymore
    console.error(`❌ Error access ${dir}:`, error.message);
  }
}

async function main() {
  // Start from project root (one level up from scripts)
  const projectRoot = path.resolve(__dirname, "..");

  console.info(`🧹 Start cleanup from: ${projectRoot}`);
  await scanAndClean(projectRoot);
  console.info("✅ Cleanup completed");
}

await main();
