---
title: Roadmap
description: Where fsharp-wasm is, and what comes next — in order, with the reasons.
order: 3
tags:
  - roadmap
  - planning
---

# Roadmap

The roadmap is ordered, not dated: this is an open-source project and timing depends on contributors and priorities. The rule behind the order is that **what is proven runs first, and new technology comes after the thing it builds on works.** Everything listed under "Next" is a plan until a card on the [projects](/projects) page says otherwise.

## Where we are

Written on 2026-11-22; the numbers are on the [tests](/tests), [demos](/demos) and [benchmarks](/benchmarks) pages with their dates.

- **A compiler** from F# to WebAssembly GC, validated by `wasm-tools`: 15 test suites pass, 699 regression tests in the main one, a differential run against .NET without a disagreement, and the programs of three other repositories (the base library, the newsletter designer, the widget editor) compiled in CI as a gate.
- **A platform around it**, all in F#: a base library with JSON, typed CSS and HTML, an edit history and icons; a canvas graphics stack with a scene graph, widgets with a semantic tree and drag and drop; a browser runtime; a widget editor and a newsletter designer, both with undo and drag and drop; a server layer and the host that runs it on Node, Bun, Deno, Cloudflare, Vercel and Netlify.
- **Two clients of one server**: the Ghost Todo of the backend has a page of the host (JavaScript) and a canvas client (F# widgets, compiled to WebAssembly GC); what one does, the other shows. 29 checks, identical answers on eight test targets; the canvas client is tested in a real browser.
- **A benchmark of the server module** against hand-written JavaScript and Hono on Node, Bun and workerd ([bench/](https://github.com/fsharp-wasm/fsharp-wasm-edge/tree/main/bench)): close on a poll with nothing new, far behind where the answer is long. A profile showed why (the string boundary), and a first fix, a bulk path for strings, made the module 2 to 5 times faster on Node (the state of 5 000 todos 20.4 ms to 6.8 ms), 4.5 to 8.5 times on Bun and 1.9 to 4.8 times on workerd (2026-11-22). What remains is in the compiled code itself, and in how the demo persists: every change writes the whole list.
- Known gaps in the language are listed, with the programs that show them, on the [status page](https://github.com/fsharp-wasm/fsharp-wasm/blob/main/docs/STATUS.md).

## Next, in order

1. **Speed that keeps the writing pleasant.** The compiler and our F# compiler are kept friendly for the person who writes the code: computation-expression builders, small DSLs (`column { … }`, `rectangle { … }`), records and pipelines. So the cost of those abstractions has to go in the compiler, not in how the code is written. In this order: (a) *done*: a bulk path for strings across the host boundary; (b) the compiled code for long strings, which the profile now points to: garbage collection, a JSON writer that builds a tree first, a string builder that grows by doubling, strings as arrays of 16-bit units; (c) *measured*: a rectangle through the builder costs about 17 ns more than through the constructors, and in a real frame of the widget editor the builders are 8 ms of 12 s of profile, so they stay as they are. What the profile did show was a page drawn 60 times a second with nobody touching it (an idle tab 29.9 % busy); the canvas host now draws only when something changed or a caret is due (0.7 % busy, 2026-11-22; [docs/performance.md](https://github.com/fsharp-wasm/fsharp-wasm-graphics/blob/develop/docs/performance.md)). Every step is measured before and after, on the same machine, and written down with its date.
2. **A pre-compiler at build time for the scene graph and for GlyphAura.** A program should carry only the scene elements, widgets, fonts and glyph data it uses: static scenes become draw lists when the module is built, the tables of a font are cut to the glyphs and features the program asks for, and what no path reaches is not in the module. The first step is a breakdown of the size of the modules we have (which library each function comes from), so that the work starts where the bytes are; the first measured target on the drawing side is the 1 322 Canvas 2D calls of one frame of the widget editor.
3. **Small glue per program.** The JavaScript of the browser runtime (the glue for the canvas, the DOM, the network) is written by hand and shipped as a set of files. The compiler already knows from the `[<Import>]` declarations which (module, name) pairs a program needs, so the glue can be made per program: written in F# and compiled to JavaScript with Fable 5, tree-shaken to what the program imports, minified and bundled. Measured first (2026-11-22, the canvas client of the Ghost Todo, bytes as shipped, not minified or compressed): the page loads 19 runtime files of 44.6 KB together, the module imports from four of them, 37 of the 63 exports in those four, and about 20.6 KB (with the loader) would be enough. Not decided yet: how much of the DOM and WebGPU binding can be written in F#.
4. **The editors, fancy and impressive.** The widget editor, the newsletter designer and the GUI editors get what makes them pleasant to use: icons on the canvas, editing text in place, a layers panel you reorder by dragging, animation where it explains a change, and everything keyboard-operable.
5. **A spreadsheet grid** ([fsharp-wasm-accounting](https://github.com/fsharp-wasm/fsharp-wasm-accounting), planned; the repository has no code yet). Formulas, rows and columns that fold into total lines, and a tree of a cell (the graph of what it is made of) that opens in a tab of its own, for the demonstration of an accounting application. It asks three things of the stack: a scene that draws only the cells in view, a formula engine with a dependency graph that recalculates only what changed, and undo through the edit history that already exists. It is the hardest test of the scene graph we can think of, which is why it is a demonstration.
6. **Real deployments.** The host and the deploy workflow are written and tested against local servers; nothing is deployed to Cloudflare, Vercel or Netlify yet. The first deployment is the proof that production runtimes accept a WebAssembly GC module, and it is where the benchmark gets numbers from a provider's machine, which it does not have today.
7. **A data science library** in the manner of NumPy and Polars (planned, no repository): typed arrays and data frames in F#, kernels with SIMD where the engine has it. It stands on step 1, because it only makes sense if the compiled code is fast.
8. **WIT and Rust libraries.** Modules described by WIT worlds and linked by a small host; a spike made a GC module a component and measured what the adapters cost. The next experiment is the other direction: a Rust library (a Polars core is the candidate) called from an F# module through WIT. The lesson of the string boundary applies: what costs is the number of crossings, so a boundary that carries a whole column in one call is the design to try, and its cost is measured against our own kernels before it is believed.
9. **An accessible GUI layer.** What people read and operate has to be semantic HTML with keyboard and screen-reader support, themeable with a plain CSS framework; the canvas graphics stay for drawing and editors. The widgets already carry a semantic tree; the browser side that turns it into elements is next.
10. **Tests that run everywhere, a release, the gaps.** The browser tests run in Chromium only; Firefox and Safari get covered. The latest release of the compiler predates most of this work and repositories should depend on a release binary instead of a submodule. Language and library gaps: `async` and JSPI, `sprintf "%A"`, a few `System` methods.
11. **Independence.** Fewer dependencies on .NET's standard libraries and third-party packages: our own base library and our own graphics and text stack.

## How we got here

The compiler began as a back end for Fable that emitted WebAssembly Text, grew a binary encoder, closures, unions, pattern matching, collections and strings on the GC heap, the host boundary with two string conventions, a base library of its own and a Component Model experiment. The libraries, the editors and the host came when the compiler could compile them, and each of them found things the compiler did not do yet: the compiler was fixed first every time, with a test that fails without the fix.

## Help shape it

Good places to start: a program that does not compile (an [issue](https://github.com/fsharp-wasm/fsharp-wasm/issues) with the F# source is the best bug report — it becomes a test), a benchmark we should add, a platform we should run on, documentation.
