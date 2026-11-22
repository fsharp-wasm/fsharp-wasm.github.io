# Recorded benchmark reports of fsharp-wasm-runtime

These JSON files are copies of `site/benchmarks/` of [fsharp-wasm-runtime](https://github.com/fsharp-wasm/fsharp-wasm-runtime) (commit `a1394a8`; the size and network reports recorded 2026-11-22, the speed reports and the real-host measurement 2026-11-14), unchanged; `src/data/runtimeBench.ts`
turns them into the tables of `/benchmarks` at build time. When the runtime records new ones, copy the files named in `manifest.json` again (and `node-24-no-wasm-inlining.json`), and the page follows.
The raw files are also served by the runtime's own page, so anything on the site can be checked against the report it came from.
