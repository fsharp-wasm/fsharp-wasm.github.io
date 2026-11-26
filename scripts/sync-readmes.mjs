#!/usr/bin/env node
// Writes the status badges into the README of every repository that has a checkout next to this one, from src/data/status.json: the same file the page /status is made from.
//
//   node scripts/sync-readmes.mjs           says which READMEs would change
//   node scripts/sync-readmes.mjs --write   changes them
//
// The block sits under the title, between <!-- status --> and <!-- /status -->; it is replaced when it is there and added when it is not, so a second run changes nothing.  A plain
// badge of the same workflow that a README had before (outside the block) is removed, so that none is shown twice.  The platform line below it (`<!-- platform -->`) gets the link to the
// page.  The forks are not touched (their README is upstream's); a repository without a workflow gets the link only.
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const status = JSON.parse(await readFile(join(here, "../src/data/status.json"), "utf8"));
const write = process.argv.includes("--write");
const forks = new Set(["fsharp", "Fable"]);
const page = "https://fsharp-wasm.github.io/status/";

/** The badge of a workflow: for the branch it is about (develop, or main for a deployment), linking to the workflow's runs. */
const badge = (repo, w) => {
  const branch = (w.branches ?? ["develop"])[0];
  const base = `https://github.com/${status.org}/${repo}/actions/workflows/${w.file}`;
  return `[![${w.name}](${base}/badge.svg?branch=${branch})](${base})`;
};
const block = (repo, entry) => {
  const badges = entry.workflows.filter((w) => w.badge !== false).map((w) => badge(repo, w));
  return ["<!-- status -->", `${badges.length ? badges.join(" ") + " · " : ""}[Status of every repository](${page})`, "<!-- /status -->"].join("\n");
};

let changed = 0;
for (const [repo, entry] of Object.entries(status.repos)) {
  const path = join(here, "../..", repo, "README.md");
  if (forks.has(repo) || !existsSync(path)) { console.log(`  skipped ${repo} (${forks.has(repo) ? "a fork" : "no checkout"})`); continue; }
  const before = await readFile(path, "utf8");
  let text = before.replace(/\r\n/g, "\n");
  // a plain badge of a workflow of this repository from before: gone (the block has it)
  for (const w of entry.workflows) {
    const plain = new RegExp(`^\\[!\\[[^\\]]*\\]\\(https://github\\.com/${status.org}/${repo.replace(/\./g, "\\.")}/actions/workflows/${w.file.replace(/\./g, "\\.")}/badge\\.svg(\\?branch=[a-z]+)?\\)\\]\\([^)]*\\)\\n`, "gm");
    text = text.replace(plain, "");
  }
  const fresh = block(repo, entry);
  if (/<!-- status -->[\s\S]*?<!-- \/status -->/.test(text)) text = text.replace(/<!-- status -->[\s\S]*?<!-- \/status -->/, fresh);
  else text = text.replace(/^(# .*\n)\n?/, `$1\n${fresh}\n\n`);
  // the platform line: the page next to the tests
  if (!text.includes(page)) text = text.replace(/\[Tests\]\(https:\/\/fsharp-wasm\.github\.io\/tests\/\)/, `[Tests](https://fsharp-wasm.github.io/tests/) · [Status](${page})`);
  if (text !== before) { changed++; console.log(`${write ? "  wrote" : "  would change"} ${repo}`); if (write) await writeFile(path, text); }
}
console.log(changed ? (write ? `${changed} README(s) changed` : `${changed} README(s) would change: run with --write`) : "every README is as it should be");
