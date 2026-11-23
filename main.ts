#!/usr/bin/env node
/**
 * Six Words, One Story — make.fun entry
 *
 * The entire entry is one six-word story. This program's only job is to place
 * that text at /output/entry.txt, the single path the house grader reads.
 * It is deterministic, dependency-free, and reads no network and no secrets.
 *
 * Why this story:
 *   "His flag came home. He didn't."
 *   - a folded flag handed to a family is a whole military funeral in one
 *     image; "came home" sets up an arrival that the last two words snap away.
 *   - the full stop before "He didn't" is deliberate: the denial lands as its
 *     own sentence, a gut-punch after the expected, ceremonial first clause.
 *   - no war, no date, no cause of death is named, so the reader supplies all
 *     of it: the question "didn't what?" answers itself in the reader's mind.
 *   All six words are load-bearing: owner, symbol, motion, destination,
 *   subject and reversal. The line is original, so it cannot be a byte-copy of
 *   the house's sealed reference texts.
 */

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

/**
 * The story as six explicit tokens, and the only thing the judge sees.
 * Keeping the words in an array makes the six-word constraint visible at a
 * glance and prevents an accidental seventh word from slipping in.
 */
const STORY_WORDS = ["His", "flag", "came", "home.", "He", "didn't."] as const;
const ENTRY_TEXT = STORY_WORDS.join(" ");

/** The grader reads exactly this path; nothing outside the repository is read. */
const OUTPUT_FILE = "/output/entry.txt";

const REQUIRED_WORDS = 6;
const MIN_LENGTH = 1;
const MAX_LENGTH = 60;

/** Count words the way a reader would: runs of non-whitespace. */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** UTF-8 byte length, independent of any platform encoding defaults. */
function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

/** Unicode code points — the gate measures 1-60 characters, not bytes. */
function countCharacters(text: string): number {
  return Array.from(text).length;
}

/** Fail early if the story could never pass the gate or the judge's brief. */
function validate(text: string): void {
  if (text !== text.trim() || text.trim().length === 0) {
    throw new Error("The entry must be non-blank with no outer whitespace.");
  }

  // The judge reads one line. A stray newline would split the story and break
  // the six-word read, so refuse it before anything reaches the graded path.
  if (/\r|\n/.test(text)) {
    throw new Error("The entry must be a single line.");
  }

  const words = countWords(text);
  if (words !== REQUIRED_WORDS) {
    throw new Error(
      `A six-word story needs exactly ${REQUIRED_WORDS} words; got ${words}.`,
    );
  }

  // The sealed gate counts characters; check that first, then confirm the
  // text is valid UTF-8 and stays inside the byte cap as a second safeguard.
  const characters = countCharacters(text);
  if (characters < MIN_LENGTH || characters > MAX_LENGTH) {
    throw new Error(
      `The gate allows ${MIN_LENGTH}-${MAX_LENGTH} characters; got ${characters}.`,
    );
  }

  const size = byteLength(text);
  if (size < MIN_LENGTH || size > MAX_LENGTH) {
    throw new Error(
      `The story must also fit ${MIN_LENGTH}-${MAX_LENGTH} UTF-8 bytes; got ${size}.`,
    );
  }
}

/** Write the story to the graded path and read it back to prove the write. */
function writeEntry(text: string): void {
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, text, { encoding: "utf8", flag: "w" });

  if (readFileSync(OUTPUT_FILE, "utf8") !== text) {
    throw new Error("The written entry did not match the authored story.");
  }
}

function main(): void {
  validate(ENTRY_TEXT);
  writeEntry(ENTRY_TEXT);
}

main();
