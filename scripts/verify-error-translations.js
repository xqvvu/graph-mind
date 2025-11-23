#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

// File paths
const ERROR_CODES_FILE = path.join(
  import.meta.dirname,
  "../packages/shared/src/lib/error-codes.ts",
);
const ZH_CN_FILE = path.join(
  import.meta.dirname,
  "../apps/web/messages/zh-CN.json",
);
const EN_US_FILE = path.join(
  import.meta.dirname,
  "../apps/web/messages/en-US.json",
);

// Extract all error codes from ErrorCode
function extractErrorCodes() {
  const content = fs.readFileSync(ERROR_CODES_FILE, "utf8");
  const codes = new Set();

  // System codes
  codes.add("0");
  codes.add("-1");
  codes.add("-2");
  codes.add("-3");
  codes.add("-4");

  // Extract 5-digit codes
  const matches = content.matchAll(/:\s*(\d{5})/g);
  for (const match of matches) {
    codes.add(match[1]);
  }

  return Array.from(codes).sort((a, b) => Number(a) - Number(b));
}

// Load translations
function loadTranslations(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(content);
  return new Set(Object.keys(data.error_code || {}));
}

// Main verification
function main() {
  console.log("🔍 Verifying error code translations...\n");

  const allCodes = extractErrorCodes();
  const zhCNCodes = loadTranslations(ZH_CN_FILE);
  const enUSCodes = loadTranslations(EN_US_FILE);

  console.log(`📊 Total error codes in ErrorCode: ${allCodes.length}`);
  console.log(`📊 Translations in zh-CN: ${zhCNCodes.size}`);
  console.log(`📊 Translations in en-US: ${enUSCodes.size}\n`);

  // Check missing translations
  const missingZhCN = allCodes.filter((code) => !zhCNCodes.has(code));
  const missingEnUS = allCodes.filter((code) => !enUSCodes.has(code));

  let hasErrors = false;

  if (missingZhCN.length > 0) {
    hasErrors = true;
    console.error("❌ Missing translations in zh-CN:");
    console.error("  ", missingZhCN.join(", "));
    console.error("");
  }

  if (missingEnUS.length > 0) {
    hasErrors = true;
    console.error("❌ Missing translations in en-US:");
    console.error("  ", missingEnUS.join(", "));
    console.error("");
  }

  // Check orphaned translations
  const orphanedZhCN = Array.from(zhCNCodes).filter(
    (code) => !allCodes.includes(code),
  );
  const orphanedEnUS = Array.from(enUSCodes).filter(
    (code) => !allCodes.includes(code),
  );

  if (orphanedZhCN.length > 0) {
    console.warn("⚠️  Orphaned translations in zh-CN (not in ErrorCode):");
    console.warn("  ", orphanedZhCN.join(", "));
    console.warn("   Consider removing these or adding them to ErrorCode\n");
  }

  if (orphanedEnUS.length > 0) {
    console.warn("⚠️  Orphaned translations in en-US (not in ErrorCode):");
    console.warn("  ", orphanedEnUS.join(", "));
    console.warn("   Consider removing these or adding them to ErrorCode\n");
  }

  if (!hasErrors && orphanedZhCN.length === 0 && orphanedEnUS.length === 0) {
    console.log("✅ All error codes have complete translations!\n");
    return 0;
  }

  if (!hasErrors) {
    console.log(
      "✅ All ErrorCode error codes have translations (but there are orphaned codes)\n",
    );
    return 0;
  }

  console.error(
    "❌ Translation verification failed. Please add missing translations.\n",
  );
  return 1;
}

// Run verification
const exitCode = main();
process.exit(exitCode);
