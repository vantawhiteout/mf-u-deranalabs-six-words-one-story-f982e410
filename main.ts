#!/usr/bin/env node
/**
 * Six Words, One Story — make.fun entry
 *
 * The entire entry is one six-word story. This program's only job is to place
 * that text at /output/entry.txt, the single path the house grader reads.
 * It is deterministic, dependency-free, and reads no network and no secrets.
 *
 * The story is stored as six explicit word tokens. That keeps the hard
 * constraint visible in one place, makes an accidental seventh word obvious,
 * and lets the validator check the exact text the judge will receive.
 *
 * Why this line: a folded flag handed to a family is a whole military funeral
 * in one image. "Came home" promises the soldier's return; "He didn't." snaps
 * that promise away in its own sentence. No war, date or cause is named, so
 * the reader supplies all of it. All six words are load-bearing.
 */

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

/** The six words the judge sees, in reading order. */
const STORY_WORDS = ["His", "flag", "came", "home.", "He", "didn't."] as const;

/** The single line handed to the judge: no newline, no decoration, no prefix. */
const ENTRY_TEXT = STORY_WORDS.join(" ");

/** The grader reads exactly this path; nothing outside the repository is read. */
const OUTPUT_FILE = "/output/entry.txt";

/** The brief requires six words; the gate requires 1-60 characters of UTF-8. */
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

/** Unicode code points — the gate measures characters, not bytes. */
function countCharacters(text: string): number {
  return Array.from(text).length;
}

/** Fail early if the story could never pass the gate or the judge's brief. */
function validate(words: readonly string[], text: string): void {
  if (words.length !== REQUIRED_WORDS) {
    throw new Error(
      `A six-word story needs exactly ${REQUIRED_WORDS} word tokens; got ${words.length}.`,
    );
  }
  if (words.some((word) => word.length === 0 || /\s/.test(word))) {
    throw new Error("Each word token must be a single, non-empty word.");
  }
  if (text !== text.trim() || text.length === 0) {
    throw new Error("The entry must be non-blank with no outer whitespace.");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("The entry must be a single line.");
  }
  if (countWords(text) !== REQUIRED_WORDS) {
    throw new Error(
      `The rendered entry must contain ${REQUIRED_WORDS} words; got ${countWords(text)}.`,
    );
  }
  if (text !== words.join(" ")) {
    throw new Error("The rendered entry does not match the word tokens.");
  }

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

/**
 * Prove the validator actually rejects the failure modes that would cost the
 * entry its place: a seventh word, a second line, and an over-long string.
 * Pure, deterministic, and silent on success; it never touches the output.
 */
function selfTest(): void {
  const badCases: Array<[readonly string[], string]> = [
    [["One", "two", "three", "four", "five", "six", "seven"], "one two three four five six seven"],
    [["One", "two", "three", "four", "five", "six"], "One two three four five\nsix"],
    [["x".repeat(61)], "x".repeat(61)],
  ];

  for (const [words, text] of badCases) {
    let rejected = false;
    try {
      validate(words, text);
    } catch {
      rejected = true;
    }
    if (!rejected) {
      throw new Error("Validator self-test failed: an invalid entry was accepted.");
    }
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
  selfTest();
  validate(STORY_WORDS, ENTRY_TEXT);
  writeEntry(ENTRY_TEXT);
}

main();
