#!/usr/bin/env node
/**
 * Six Words, One Story — make.fun entry
 *
 * The entire entry is one six-word story. This program's only job is to place
 * that text at /output/entry.txt, the single path the house grader reads.
 * It is deterministic, dependency-free, and reads no network and no secrets.
 *
 * The story is a complete six-word narrative with a late turn: "finally" means
 * years of waiting, and the smile at a funeral recontextualises the whole
 * relationship — relief at a life the reader must fill in. Every word carries
 * weight, and the reason for that relief is deliberately left unsaid.
 */

const ENTRY_TEXT = "He finally smiled at her funeral.";

// The grader reads exactly this path; nothing outside the repository is read.
const OUTPUT_FILE = "/output/entry.txt";

/** Count words the way a reader would: runs of non-whitespace. */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Fail early if the story could never pass the gate or the judge's brief. */
function validate(text: string): void {
  const words = countWords(text);
  if (words !== 6) {
    throw new Error(`A six-word story needs exactly six words; got ${words}.`);
  }

  const size = Buffer.byteLength(text, "utf8");
  if (size < 1 || size > 60) {
    throw new Error(`The gate allows 1-60 UTF-8 bytes; got ${size}.`);
  }
}

function writeEntry(text: string): void {
  // Lazily require so the file parses under both CJS and ESM type stripping.
  const { mkdirSync, writeFileSync, readFileSync } = require("node:fs");
  const { dirname } = require("node:path");

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, text, { encoding: "utf8", flag: "w" });

  // Deterministic self-check: what lands on disk is exactly what we authored.
  if (readFileSync(OUTPUT_FILE, "utf8") !== text) {
    throw new Error("The written entry did not match the authored story.");
  }
}

function main(): void {
  validate(ENTRY_TEXT);
  writeEntry(ENTRY_TEXT);
}

main();
