// The catalogue of what exists: demos, examples, benchmarks and tests of every fsharp-wasm repository.
// One source for the pages /demos, /examples, /benchmarks and /tests, so that a number is written once.
//
// Counts are from a recorded run (see `recordedOn`), not from a badge; where a suite has no count here it was not counted.
// `ci` says whether that repository's CI runs the suite.  A suite that does not run, or does not pass, is listed as such.

export const recordedOn = '2026-11-16';
const org = 'https://github.com/fsharp-wasm';
const pages = 'https://fsharp-wasm.github.io/fsharp-wasm-runtime';

export type Repo =
  | 'fsharp-wasm'
  | 'fsharp-wasm-core'
  | 'fsharp-wasm-runtime'
  | 'fsharp-wasm-graphics'
  | 'fsharp-glyph-aura'
  | 'fsharp-wasm-ide'
  | 'fsharp-wasm-backend'
  | 'fsharp-wasm-edge'
  | 'fsharp-wasmecto';

export const repoUrl = (repo: Repo) => `${org}/${repo}`;
export const sourceUrl = (repo: Repo, path: string) => `${org}/${repo}/tree/main/${path}`;

// ── Demos: live in the browser ─────────────────────────────────────────────────────────────────────────────────────────

export type DemoGroup = 'apps' | 'platform' | 'graphics' | 'measure';
export interface Demo {
  id: string;
  title: string;
  summary: string;
  group: DemoGroup;
  icon: string;
  /** what the demo puts on the page: real HTML, or pixels drawn onto a canvas */
  output: 'html' | 'canvas' | 'html + worker';
}
export const demoUrl = (d: Demo) => `${pages}/demos/${d.id}/`;
export const demoSource = (d: Demo) => sourceUrl('fsharp-wasm-runtime', `demos/${d.id}`);

export const demos: Demo[] = [
  { id: 'counter', title: 'Counter', group: 'apps', icon: 'tabler:plus-minus', output: 'html', summary: 'Classic increment / decrement counter: model, update and view in F# (Elmish MVU).' },
  { id: 'todo', title: 'Todo list', group: 'apps', icon: 'tabler:checklist', output: 'html', summary: 'Add, complete and remove todos: the full model-update-view cycle in F#.' },
  { id: 'full-dashboard', title: 'Full dashboard', group: 'apps', icon: 'tabler:layout-dashboard', output: 'html', summary: 'The counter, the todo list, a canvas, a message bus and storage in one tabbed layout.' },
  { id: 'web-component', title: 'Web component', group: 'apps', icon: 'tabler:components', output: 'html', summary: 'A custom element, <code>&lt;fs-counter&gt;</code>, defined entirely in F#: embed it anywhere.' },
  { id: 'indexeddb-crud', title: 'IndexedDB CRUD', group: 'platform', icon: 'tabler:database', output: 'html', summary: 'Create, read, update and delete records in IndexedDB, wired from F#.' },
  { id: 'realtime-pubsub', title: 'Realtime pub/sub', group: 'platform', icon: 'tabler:broadcast', output: 'html', summary: 'A message bus over a BroadcastChannel: open the page in two tabs and watch messages cross.' },
  { id: 'worker-actor', title: 'Worker actor', group: 'platform', icon: 'tabler:cpu', output: 'html + worker', summary: 'An actor running inside a Web Worker; the main thread sends messages and gets replies, all in F#.' },
  { id: 'webgpu-basic', title: 'WebGPU basics', group: 'platform', icon: 'tabler:brand-speedtest', output: 'canvas', summary: 'A GPU compute pipeline bootstrapped from F#. Needs a browser with WebGPU.' },
  { id: 'canvas-mandelbrot', title: 'Mandelbrot', group: 'graphics', icon: 'tabler:math-function', output: 'canvas', summary: 'Escape-time calculation in F#; every calculation is a native WebAssembly GC call.' },
  { id: 'graphics-gallery', title: 'Scene gallery', group: 'graphics', icon: 'tabler:photo', output: 'canvas', summary: 'Thirteen scenes of the FSharp.Graphics library: shapes, strokes, gradients, shadows, transforms, layout, clipping, layers, text, animation, interaction, a dashboard and a stress test.' },
  { id: 'widget-editor', title: 'Widget editor', group: 'graphics', icon: 'tabler:layout-grid', output: 'canvas', summary: 'A visual editor for widget layouts, itself written in F# and drawn by the module: palette, design surface, inspector, generated code.' },
  { id: 'bench', title: 'Benchmark', group: 'measure', icon: 'tabler:chart-bar', output: 'html + worker', summary: 'Thirteen kernels in F# and in plain JavaScript, measured in your browser, with the method and the spread.' },
];

// ── Examples: code to read and run ─────────────────────────────────────────────────────────────────────────────────────

export interface Example {
  title: string;
  repo: Repo;
  path: string;
  summary: string;
  /** how to run it, from the repository root */
  run?: string;
  kind: 'language' | 'components' | 'backend' | 'graphics' | 'text' | 'tools' | 'research';
  checks?: number;
}

export const examples: Example[] = [
  { title: 'Showcase: classic algorithms', repo: 'fsharp-wasm', path: 'tests/Showcase', kind: 'language', checks: 26, run: 'bash tests/Showcase/run.sh',
    summary: 'Fibonacci, primes, two Project Euler problems, Collatz, FizzBuzz, list and array pipelines, records, sorting, strings and options — compiled to WasmGC and checked on Node.' },
  { title: 'Component embed', repo: 'fsharp-wasm', path: 'examples/component-embed', kind: 'components', checks: 39, run: 'cd examples/component-embed && bash run.sh',
    summary: 'A small F# module (MathCore) compiled to WasmGC; its WIT world is generated and embedded with wasm-tools.' },
  { title: 'Component linking', repo: 'fsharp-wasm', path: 'examples/component-linking', kind: 'components', checks: 22, run: 'cd examples/component-linking && bash run.sh',
    summary: 'Two independent F# modules, MathCore and App, compiled separately and linked at run time: the app imports the core’s functions.' },
  { title: 'Ghost Todo', repo: 'fsharp-wasm-backend', path: 'demos/ghost-todo', kind: 'backend',
    summary: 'A server module in F#, 47 KB of WebAssembly GC: a todo list whose every change is a binary patch that a client applies to a shadow copy. Runs on six platforms in the test matrix.' },
  { title: 'Ghost Todo on a canvas', repo: 'fsharp-wasm-backend', path: 'demos/ghost-todo-canvas', kind: 'backend', checks: 22, run: 'bash build/build.sh --module canvas && node tests/e2e/canvas.mjs',
    summary: 'The second client of the same server, written in F# with the widgets of fsharp-wasm-graphics and drawn onto a canvas (197 KB of WebAssembly GC). It keeps a shadow of the list, applies the patches, copes with a server that is gone and can be operated by keyboard. Served by every platform at /canvas/; what it does shows on the first client and the other way round.' },
  { title: 'Ghost Todo benchmark', repo: 'fsharp-wasm-edge', path: 'bench', kind: 'backend', run: 'node bench/run.mjs',
    summary: 'The module against hand-written JavaScript and Hono on Node, Bun and workerd, with three implementations that answer identically: close on a poll, 14 to 24 times slower on Node where the answer is long (measured 2026-11-22, local and in-process); the numbers and what they mean are in the README.' },
  { title: 'Platform matrix', repo: 'fsharp-wasm-edge', path: 'tests/platforms', kind: 'backend', run: 'npm ci && node build/package.mjs && node tests/platforms/run.mjs',
    summary: 'The same module on Node, Bun, Deno, Cloudflare Workers (with a Durable Object), the Vercel and Netlify handlers: one command, identical answers.' },
  { title: 'Scene gallery sources', repo: 'fsharp-wasm-graphics', path: 'demo/FSharp.Graphics.Browser.Gallery', kind: 'graphics',
    summary: 'The module behind the live scene gallery and the thirteen scenes it shows (FSharp.Graphics.Scenes).' },
  { title: 'Scene renderer (PNG)', repo: 'fsharp-wasm-graphics', path: 'demo/FSharp.Graphics.Demo', kind: 'graphics', run: 'dotnet run --project demo/FSharp.Graphics.Demo -- --list',
    summary: 'Renders every scene with the software rasterizer to one PNG per scene plus an index page; exits 1 if a command stream is malformed.' },
  { title: 'Desktop runner', repo: 'fsharp-wasm-graphics', path: 'demo/FSharp.Graphics.DesktopRunner', kind: 'graphics',
    summary: 'A native desktop host for the same scenes: arrow keys switch scenes, B toggles the Skia and the software backend (same command stream, so a difference is a bug), F12 takes a screenshot.' },
  { title: 'Widget editor', repo: 'fsharp-wasm-ide', path: 'src', kind: 'tools',
    summary: 'The visual editor for FSharp.Graphics widget layouts, written in F# and compiled to WebAssembly GC; also a live demo.' },
  { title: 'GlyphAura demo', repo: 'fsharp-glyph-aura', path: 'demo/GlyphAura.Demo', kind: 'text', run: 'dotnet run --project demo/GlyphAura.Demo',
    summary: 'Shapes a line of text with GlyphAura and prints an ASCII rendering of the layout.' },
  { title: 'WIT component spikes', repo: 'fsharp-wasm-edge', path: 'docs/spikes/wit-glue', kind: 'research',
    summary: 'A WebAssembly GC module made a WIT component two ways (a second module for the memory; the adapters inside the module), run through jco on Node, with measured cost.' },
];

// ── Benchmarks ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface Kernel {
  name: string;
  stresses: string;
  standard: string;
  note?: string;
}
export const kernels: Kernel[] = [
  { name: 'Mandelbrot', stresses: 'double arithmetic in a branchy inner loop', standard: '700² points' },
  { name: 'N-body', stresses: 'double arithmetic on small arrays, sqrt', standard: '1 000 000 steps' },
  { name: 'Spectral norm', stresses: 'nested loops, int→double, division', standard: 'n = 700' },
  { name: 'Matrix product', stresses: 'dense array reads and writes', standard: '400³' },
  { name: 'Sieve', stresses: 'byte-array writes with a stride', standard: '5 000 000' },
  { name: 'Fannkuch-redux', stresses: 'int array shuffling in tight loops', standard: 'n = 9' },
  { name: 'CRC-32', stresses: '32-bit integer operations, table lookups', standard: '16 000 000 bytes' },
  { name: 'Collatz', stresses: '64-bit integers (int64 in F#, doubles in JavaScript)', standard: 'starts < 300 000' },
  { name: 'Fibonacci', stresses: 'function calls, recursion', standard: 'fib 35' },
  { name: 'Binary trees', stresses: 'allocation and garbage collection', standard: 'depth 15' },
  { name: 'Word count', stresses: 'string building, hashing, comparison', standard: '1 200 000 words' },
  { name: 'Quicksort', stresses: 'int array partitioning, recursion', standard: '1 500 000 ints' },
  { name: 'List pipeline', stresses: 'map / filter / fold over a collection', standard: '3 000 000 elements', note: 'The compiler fuses the three steps into one loop; this row measures that optimisation and is left out of the second geometric mean.' },
];

export interface BenchSuite {
  title: string;
  where: string;
  summary: string;
  href?: string;
  run?: string;
}
export const benchSuites: BenchSuite[] = [
  { title: 'Speed — F# against JavaScript', where: 'fsharp-wasm-runtime', href: `${pages}/benchmarks/`,
    summary: 'The thirteen kernels above, each written twice with the same algorithm, on Node, Deno, Bun and Chromium; cold call, warm-up, alternating samples, median and spread, results compared bit for bit.',
    run: 'node demos/bench/run.mjs --profile standard' },
  { title: 'Speed — in your browser', where: 'fsharp-wasm-runtime', href: `${pages}/demos/bench/`,
    summary: 'The same harness as a page: choose the kernels, see the chart and the table, download the JSON.' },
  { title: 'Binary size', where: 'fsharp-wasm-runtime', href: `${pages}/benchmarks/`,
    summary: 'Raw, gzip and brotli size of every module and of what each page loads: 12–153 KB raw, 4–45 KB with brotli.' },
  { title: 'Network — download and compile', where: 'fsharp-wasm-runtime', href: `${pages}/benchmarks/`,
    summary: 'Every module on five emulated networks (localhost, Wi-Fi, 4G, slow 4G, 3G) with three encodings; the benchmark page can also measure your own line.',
    run: 'E2E_ROOT=site node tests/e2e/network.mjs' },
  { title: 'Compiler optimisations, measured', where: 'fsharp-wasm-runtime', href: `${org}/fsharp-wasm-runtime/blob/main/docs/benchmarks.md`,
    summary: 'A/B runs with V8’s own inliner off, with the compiler’s optional inliner, and with packed bool[] / byte[] arrays; the reports are published as JSON.' },
  { title: '.NET against WebAssembly', where: 'fsharp-wasm', href: sourceUrl('fsharp-wasm', 'tests/Bench'),
    summary: 'The same F# functions on .NET (Release) and as WebAssembly on Node: the checksums must be identical, the times go to the CI job summary.',
    run: 'bash tests/Bench/run.sh' },
];

// ── Tests ──────────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface Suite {
  name: string;
  what: string;
  /** named tests or checks in the recorded run */
  count?: number;
  /** a workload that is not a count of named tests (generated inputs) */
  workload?: string;
  ci: 'yes' | 'no';
  /** the same checks are counted in another suite: leave out of the totals */
  duplicate?: boolean;
  /** only when the suite does not pass right now */
  status?: string;
  run: string;
}
export interface RepoTests {
  repo: Repo;
  summary: string;
  suites: Suite[];
}

export const tests: RepoTests[] = [
  {
    repo: 'fsharp-wasm',
    summary: 'The compiler. tests/run-all.sh runs every suite and prints one table.',
    suites: [
      { name: 'QuickTest', count: 675, ci: 'yes', run: 'bash tests/QuickTest/run.sh',
        what: 'The compiler’s main regression suite: language features, collections, strings, closures, numerics, arrays; compiled once, run on Node. CI runs it three times: default, with unpacked bool[] / byte[], and with the inlining pass.' },
      { name: 'QuickTestMulti', workload: '17 domains, all passing', ci: 'yes', run: 'bash tests/QuickTestMulti/run.sh',
        what: 'The same kind of test, one compilation per domain (Array, Bitwise, Closures, DU, Exceptions, Interop, List, Map, Math, Option, Primitives, Printf, Result, Seq, Set, StringBuilder, Strings), so a failure names the area that broke.' },
      { name: 'Differential: .NET against wasm', workload: '392 functions, 183 012 calls: 179 115 identical, 0 disagreements, 3 896 where both sides fail, 1 known difference', ci: 'yes', run: 'bash tests/Differential/run-props.sh',
        what: 'Generated inputs go through the same F# functions on .NET (the reference) and as WebAssembly; the results must be identical. CI also runs it over the QuickTest and Showcase sources.' },
      { name: 'Showcase', count: 26, ci: 'yes', run: 'bash tests/Showcase/run.sh',
        what: 'Classic algorithms and small programs end to end (see Examples).' },
      { name: 'Host interop', count: 14, ci: 'yes', run: 'bash tests/HostInterop/run.sh',
        what: 'The host boundary: callbacks delivered later, strings and numbers across, 500 closures called and called again after a GC.' },
      { name: 'String ABI (exports)', count: 5, ci: 'yes', run: 'bash tests/StringAbi/run.sh',
        what: 'The module imports no wasm:js-string; the accessor exports exist; non-ASCII text round-trips; the empty string and null; a string of 10 000 characters.' },
      { name: 'IR pass tests', count: 27, workload: 'plus 50 000 random programs checked for equal results and unique binders', ci: 'yes', run: 'dotnet run -c Release --project tests/PassTests',
        what: 'Unit tests of the optimiser passes (pipe removal, partial application, shadowing, printf inlining, loop flattening), with property tests over generated programs.' },
      { name: 'Backend harness', workload: 'scenarios, and a closure fuzz of 30 720 checks with 0 failures', ci: 'yes', run: 'bash tests/BackendHarness/run.sh',
        what: 'Backend regression suite: every scenario goes through the binary encoder and through WAT and wasm-tools; the fuzzer generates closures and compares the variants.' },
      { name: 'BCL bootstrap', count: 11, ci: 'yes', run: 'bash tests/BclBootstrap/run.sh',
        what: 'The base library’s exceptions and math compiled through the backend and run.' },
      { name: 'Component embed', count: 39, ci: 'yes', run: 'cd examples/component-embed && bash run.sh', what: 'See Examples.' },
      { name: 'Component linking', count: 22, ci: 'yes', run: 'cd examples/component-linking && bash run.sh', what: 'See Examples.' },
      { name: 'Wasmecto tests (tests/Wasm)', count: 81, ci: 'yes', run: 'bash tests/Wasm/run-tests.sh',
        what: 'A test project written with the Wasmecto framework, compiled to WebAssembly and run in Node: language core, collections, closures, a compiler pipeline smoke test.' },
    ],
  },
  {
    repo: 'fsharp-wasm-core',
    summary: 'The F# base library of compiled programs.',
    suites: [
      { name: 'Core tests (Expecto)', count: 90, ci: 'yes', run: 'dotnet run --project tests/FSharp.WasmCore.Tests -c Release',
        what: 'Dictionary, interfaces, math, ResizeArray, Stack and StringBuilder of the base library, under .NET with the BCL’s own types.' },
    ],
  },
  {
    repo: 'fsharp-wasmecto',
    summary: 'The test framework itself.',
    suites: [
      { name: 'Wasmecto’s own tests', count: 36, ci: 'yes', run: 'bash run-tests.sh',
        what: 'Dictionary, math, stack and StringBuilder tests compiled to WebAssembly with the Expecto-style framework, against the whole base library, and run in Node.' },
    ],
  },
  {
    repo: 'fsharp-wasm-runtime',
    summary: 'The browser runtime, the demos and the benchmarks.',
    suites: [
      { name: 'Site', ci: 'yes', run: 'node tests/e2e/site.mjs', what: 'The deployable site in Chromium: the landing page, the demos embedded in it, the live benchmark, every link.' },
      { name: 'Demos', ci: 'yes', run: 'node tests/e2e/demos.mjs', what: 'Every demo, compiled from F# to WasmGC, runs in a real Chromium and does what its source says.' },
      { name: 'Benchmark page', ci: 'yes', run: 'E2E_ROOT=site node tests/e2e/bench.mjs', what: 'The module and the worker load, every kernel agrees with its JavaScript twin, the chart and the table show every kernel, the tooltip answers, the JSON can be downloaded.' },
      { name: 'Benchmark on Node', ci: 'yes', run: 'node demos/bench/run.mjs --profile quick', what: 'The same harness from a terminal; exits 1 if a result differs.' },
      { name: 'Unit tests', ci: 'no', run: 'npm test', what: 'Elmish, HTML, CSS and pub/sub tests written in F#, compiled to WebAssembly and run.' },
      { name: 'Playwright specs', workload: '21 specs defined (gallery, Mandelbrot, counter, todo, web components)', ci: 'no', run: 'npx playwright test', what: 'Demo and web-component specs in Playwright.' },
    ],
  },
  {
    repo: 'fsharp-wasm-graphics',
    summary: 'The graphics stack: 281 tests and checks in five projects.',
    suites: [
      { name: 'Math', count: 37, workload: 'plus 200 generated cases', ci: 'yes', run: 'dotnet run --project tests/FSharp.Math.Tests -c Release', what: 'Vectors, matrices, colours, Bézier.' },
      { name: 'Unit and property', count: 118, workload: '63 unit and 55 property tests', ci: 'yes', run: 'dotnet run --project tests/FSharp.Graphics.Tests -c Release', what: 'The scene graph, layout, the command protocol and the TEA runtime.' },
      { name: 'Wasm entry', count: 30, ci: 'yes', run: 'dotnet run --project tests/FSharp.Graphics.WasmTests -c Release', what: 'The module entry points a host calls: mount, dispatch, render, submit.' },
      { name: 'Host', count: 78, ci: 'no', run: 'dotnet run --project tests/FSharp.Graphics.HostTests -c Release', what: 'Hit testing, dispatch, timelines and easing, the command protocol, software-backend pixels.' },
      { name: 'Golden images', count: 18, ci: 'yes', run: 'dotnet run --project tests/FSharp.Graphics.GoldenTests -c Release -- --compare', what: 'Eighteen scenes rendered by the software rasterizer and compared with PNG goldens.' },
    ],
  },
  {
    repo: 'fsharp-glyph-aura',
    summary: 'Text shaping and layout.',
    suites: [
      { name: 'GlyphAura tests', count: 223, ci: 'yes', run: 'dotnet test tests/GlyphAura.Tests', what: 'OpenType shaping, SDF layout and glyph handling, including FsCheck property tests.' },
    ],
  },
  {
    repo: 'fsharp-wasm-ide',
    summary: 'The widget editor.',
    suites: [
      { name: 'Session test', ci: 'yes', run: 'dotnet run --project tests/WidgetEditor.Session -c Release -- shots', what: 'Headless: a scripted pointer and keyboard session runs through the real hit tester and key path, the scenes are rendered by the software renderer, and the model is checked after every step; it writes the session’s screenshots.' },
      { name: 'Editor in Chromium', ci: 'yes', run: 'node tests/e2e/editor.mjs', what: 'The compiled editor in a real Chromium: it draws everything on one canvas, so it is driven by pointer and key events at canvas coordinates and judged by what the canvas shows.' },
    ],
  },
  {
    repo: 'fsharp-wasm-backend',
    summary: 'Server modules and the .NET reference libraries.',
    suites: [
      { name: '.NET libraries', count: 96, ci: 'yes', run: 'dotnet test FSharp.Wasm.slnx -c Release', what: 'GGBP protocol, the shadow graph, reactive state, components, auth, contracts, observability.' },
      { name: 'Portable layer', count: 61, ci: 'yes', run: 'dotnet test FSharp.Wasm.slnx -c Release', what: 'The F# layer modules are built on, checked against the .NET reference: the encoding equals its bytes for 2 000 random patches; decoding bad input never raises. Seven of the tests are the shadow of the clients: the patches of 300 random steps applied in order give the server’s list.' },
      { name: 'Canvas client, in process', count: 10, ci: 'yes', run: 'dotnet test FSharp.Wasm.slnx -c Release', what: 'The canvas client against the real application in the same process: starting, adding, a second client that polls, a patch that comes twice, a gap in the patches, a server that is gone, a stale client.' },
      { name: 'Canvas client in Chromium', count: 12, ci: 'yes', run: 'bash build/build.sh --module canvas && node tests/e2e/canvas.mjs', what: 'The compiled module against the real Ghost Todo module on the host, next to the page of the first client: typing, a click and the keyboard sent as fast as a script can, and what each client does shows on the other.' },
      { name: 'Module on the host', count: 29, duplicate: true, workload: '29 checks on every platform that can run on a runner', ci: 'yes', run: 'see fsharp-wasm-edge', what: 'CI compiles GhostTodo.wasm and runs it on the host of fsharp-wasm-edge at a fixed revision.' },
    ],
  },
  {
    repo: 'fsharp-wasm-edge',
    summary: 'The host that runs modules on edge platforms.',
    suites: [
      { name: 'Platform matrix', count: 29, workload: '29 checks on 8 targets; the answers are compared: identical in 20 steps', ci: 'yes', run: 'node tests/platforms/run.mjs', what: 'Unicode, patches applied to a shadow, parallel requests, a rolling log, 404 / 405 / 400, CORS, the page, the canvas client below /canvas/; where there is storage, the state survives a restart.' },
      { name: 'Package checks', ci: 'yes', run: 'see .github/workflows/ci.yml', what: 'wrangler deploy --dry-run for Cloudflare and netlify build --offline for Netlify, without an account.' },
      { name: 'Live check', count: 29, duplicate: true, ci: 'no', run: 'node tests/platforms/live.mjs …', what: 'The same 29 checks against real deployments. Written and tested against local servers; no deployment exists yet.' },
      { name: 'Workflow lint', ci: 'yes', run: 'actionlint', what: 'The workflows themselves.' },
    ],
  },
];

// ── Totals, derived ────────────────────────────────────────────────────────────────────────────────────────────────────

const named = tests.flatMap((r) => r.suites).filter((s) => s.count !== undefined && !s.duplicate);
export const totals = {
  /** named tests and checks, counted once (the platform checks are counted once, not per target) */
  tests: named.reduce((n, s) => n + (s.count ?? 0), 0),
  suites: tests.flatMap((r) => r.suites).length,
  repos: tests.length,
  demos: demos.length,
  kernels: kernels.length,
};
