// One source for what the projects of the platform are, so that the page /projects, the start page, the navigation, the roadmap and the READMEs of the repositories say the same.
// A status is a statement about the day it was written (`updatedOn`), not a promise: "planned" means that nothing but a plan exists.

export const updatedOn = '2026-11-22';
const org = 'https://github.com/fsharp-wasm';

export type Status = 'works' | 'growing' | 'planned';

export interface Project {
  id: string;
  name: string;
  repo?: string;
  /** one sentence: what it is */
  what: string;
  /** what exists today, in measured or checkable terms; empty for a plan */
  state: string;
  status: Status;
  icon: string;
  /** a page of this site that shows it */
  page?: { text: string; href: string };
}

export interface Layer {
  id: string;
  title: string;
  subtitle: string;
  projects: Project[];
}

export const layers: Layer[] = [
  {
    id: 'compiler',
    title: 'The compiler',
    subtitle: 'F# in, WebAssembly GC out. Everything else is built to prove it and to use it.',
    projects: [
      {
        id: 'compiler',
        name: 'fsharp-wasm',
        repo: 'fsharp-wasm',
        what: 'The compiler: F# to WebAssembly GC, with a WAT printer, a binary encoder and the host boundary.',
        state: '15 test suites pass, 699 regression tests in the main one; real programs of the other repositories are compiled in CI as a gate.',
        status: 'works',
        icon: 'tabler:cpu',
        page: { text: 'Tests', href: '/tests' },
      },
      {
        id: 'forks',
        name: 'fsharp and Fable',
        repo: 'fsharp',
        what: 'Our forks of the F# compiler and of Fable: the front end that gives the compiler the AST and the types.',
        state: 'Small changes, kept mergeable with upstream; the F# compiler is changed only after agreement.',
        status: 'works',
        icon: 'tabler:git-fork',
      },
    ],
  },
  {
    id: 'base',
    title: 'Base libraries and tests',
    subtitle: 'The lowest layer: everything above uses it, it uses nothing of ours.',
    projects: [
      {
        id: 'core',
        name: 'fsharp-wasm-core',
        repo: 'fsharp-wasm-core',
        what: 'The base library and the standard libraries: Core, Data (JSON, numbers), Ui (typed CSS and HTML, email), Edit (operations, undo history) and Icons (Lucide as typed shapes).',
        state: 'Tested under .NET and as WebAssembly GC (49 tests); a gate of the compiler.',
        status: 'works',
        icon: 'tabler:stack-2',
      },
      {
        id: 'wasmecto',
        name: 'fsharp-wasmecto',
        repo: 'fsharp-wasmecto',
        what: 'The test framework of the platform: a suite written once runs under .NET and as WebAssembly GC.',
        state: 'Runs in the compiler’s suite.',
        status: 'works',
        icon: 'tabler:flask',
      },
    ],
  },
  {
    id: 'graphics',
    title: 'Graphics and text',
    subtitle: 'Drawing, laying out, picking and typesetting, in F#, for a canvas and for a screen reader.',
    projects: [
      {
        id: 'graphics',
        name: 'fsharp-wasm-graphics',
        repo: 'fsharp-wasm-graphics',
        what: 'A retained-mode 2D scene graph with layout, picking and routing, widgets with a semantic tree, drag and drop (Interact), a canvas host and a TEA runtime.',
        state: 'Drives the widget editor and the canvas client of the Ghost Todo. 92 widget checks, 81 host checks.',
        status: 'growing',
        icon: 'tabler:layout-dashboard',
        page: { text: 'Live demos', href: '/demos' },
      },
      {
        id: 'glyph-aura',
        name: 'fsharp-glyph-aura',
        repo: 'fsharp-glyph-aura',
        what: 'OpenType shaping and SDF text layout for WebAssembly GC; it also finds the glyph under a pixel, which editing text on a canvas builds on.',
        state: 'Used by the desktop and software renderers; the browser canvas measures with the browser’s fonts for now.',
        status: 'growing',
        icon: 'tabler:typography',
      },
    ],
  },
  {
    id: 'browser',
    title: 'The browser',
    subtitle: 'The runtime that runs a module in a page, and the pages that show what it does.',
    projects: [
      {
        id: 'runtime',
        name: 'fsharp-wasm-runtime',
        repo: 'fsharp-wasm-runtime',
        what: 'The browser runtime: the Elmish loop, the Browser.Html DSL, the glue for the canvas, the DOM and the network, and the build that compiles a program with fsharp-wasm.',
        state: 'Twelve demos run in a browser; the benchmark of thirteen kernels against JavaScript is public.',
        status: 'works',
        icon: 'tabler:brand-chrome',
        page: { text: 'Benchmarks', href: '/benchmarks' },
      },
    ],
  },
  {
    id: 'apps',
    title: 'Editors and applications',
    subtitle: 'Programs that make the stack show what it can do. They are gates too: a program that stops compiling is a finding for the compiler.',
    projects: [
      {
        id: 'ide',
        name: 'fsharp-wasm-ide',
        repo: 'fsharp-wasm-ide',
        what: 'The widget editor: a visual editor for FSharp.Graphics layouts, drawn on a canvas by a WebAssembly GC module.',
        state: 'Undo and redo, drag and drop from the palette, keyboard order, export to F#; 24 session checks and 16 in Chromium.',
        status: 'growing',
        icon: 'tabler:components',
        page: { text: 'Live demos', href: '/demos' },
      },
      {
        id: 'newsletter',
        name: 'fsharp-wasm-newsletter',
        repo: 'fsharp-wasm-newsletter',
        what: 'The newsletter designer: blocks, three outputs (email, web, text), framework profiles, checks and a library of newsletters kept in the browser (new, open, duplicate, delete, search).',
        state: 'Drag and drop, inline editing, icons, undo; 65 tests and a gate of the compiler.',
        status: 'growing',
        icon: 'tabler:mail',
      },
    ],
  },
  {
    id: 'server',
    title: 'Server and edge',
    subtitle: 'The same language on the server: a module, a small host, one adapter per platform.',
    projects: [
      {
        id: 'backend',
        name: 'fsharp-wasm-backend',
        repo: 'fsharp-wasm-backend',
        what: 'The server layer and Ghost: modules written in F#, the GGBP patch format, a todo list whose every change is a patch, and a second client of it that draws with widgets on a canvas.',
        state: 'The module is 47 KB; the canvas client is 197 KB and is tested in Chromium against the real module.',
        status: 'growing',
        icon: 'tabler:server',
        page: { text: 'Backend on the edge', href: '/backend' },
      },
      {
        id: 'edge',
        name: 'fsharp-wasm-edge',
        repo: 'fsharp-wasm-edge',
        what: 'The host of the compiled modules and one small adapter per platform: Node, Bun, Deno, Cloudflare, Vercel, Netlify.',
        state: '29 checks, identical answers on eight test targets; a benchmark against hand-written JavaScript and Hono. Not deployed yet.',
        status: 'growing',
        icon: 'tabler:world',
        page: { text: 'Backend on the edge', href: '/backend' },
      },
    ],
  },
  {
    id: 'planned',
    title: 'What comes next',
    subtitle: 'Plans, in the order we expect to need them. Nothing here works yet, and the cards say so.',
    projects: [
      {
        id: 'accounting',
        name: 'fsharp-wasm-accounting',
        repo: 'fsharp-wasm-accounting',
        what: 'A spreadsheet grid with formulas, folding of rows and columns into total lines, and a tree of the cells (the graph of what a cell is made of) that opens in a tab of its own.',
        state: 'A repository exists; it has no code.',
        status: 'planned',
        icon: 'tabler:table',
      },
      {
        id: 'data',
        name: 'A data science library',
        what: 'Typed arrays and data frames in the manner of NumPy and Polars, written in F# for WebAssembly GC, with kernels that use SIMD where the engine has it.',
        state: 'An idea; no repository.',
        status: 'planned',
        icon: 'tabler:chart-dots',
      },
      {
        id: 'wit-rust',
        name: 'WIT with Rust libraries',
        what: 'Linking a compiled Rust library (a Polars core, for one) to an F# module through WIT and the component model, so that what exists in Rust is not written twice.',
        state: 'A spike made a GC module a WIT component and measured what the adapters cost; the Rust side is not tried.',
        status: 'planned',
        icon: 'tabler:plug',
      },
    ],
  },
];

export const repoUrl = (repo: string) => `${org}/${repo}`;
export const statusText: Record<Status, string> = { works: 'works and is tested', growing: 'works, still growing', planned: 'planned' };
export const allProjects = layers.flatMap((l) => l.projects);
