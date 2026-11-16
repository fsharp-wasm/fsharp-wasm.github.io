---
title: Roadmap
description: Where fsharp-wasm is, and what comes next — in order, with the reasons.
order: 3
tags:
  - roadmap
  - planning
---

# Roadmap

The roadmap is ordered, not dated: this is an open-source project and timing depends on contributors and priorities. The rule behind the order is that **what is proven runs first, and new technology comes after the thing it builds on works.** Everything listed under "Next" is planned, not done.

## Where we are

Recorded on 2026-11-14 (see [tests](/tests), [demos](/demos), [benchmarks](/benchmarks)):

- **A compiler** from F# to WebAssembly GC with a WAT printer and a binary encoder, validated by `wasm-tools`; 675 regression tests, and a differential run against .NET of 183 012 calls without a disagreement.
- **Speed and size, measured**: on V8 the F# module is faster than hand-written JavaScript in 9–11 of 13 kernels (geometric mean 1.45–1.58× without the one fused kernel); 1.03× on JavaScriptCore; whole demo applications are 12–153 KB.
- **Twelve live demos** and a benchmark you can run in your browser.
- **A server module** in F# (Ghost Todo, 47 KB) that gives identical answers on eight test targets: Node, Bun, Deno, Cloudflare Workers with a Durable Object, and the Vercel and Netlify handlers.
- **A graphics stack, text shaping and a visual widget editor** written in F# (281 + 223 tests).
- Known gaps in the language are listed, with the programs that show them, on the [status page](https://github.com/fsharp-wasm/fsharp-wasm/blob/main/docs/STATUS.md).

## Next, in order

1. **Real deployments.** The host and the deploy workflow are written and tested against local servers; nothing is deployed to Cloudflare, Vercel or Netlify yet. The first deployment is the proof that production runtimes accept a WebAssembly GC module, and a public address anyone can open.
2. **WebAssembly components.** Modules described by WIT worlds, linked by a small host. A GC module can be a component if the adapters of the canonical ABI are emitted into the module itself; experiments show it works for strings and what it costs. Next: lists, records and the worlds for the server module.
3. **A typed F# DSL for the host** — routes, stores, platform settings — usable from Fable projects.
4. **An accessible GUI layer.** Not everything can be WebAssembly drawing pixels: what people read and operate has to be semantic HTML with keyboard and screen-reader support, themeable with a plain CSS framework. The canvas graphics stay for drawing and editors. Automated accessibility checks come with it.
5. **Tests that run everywhere.** Two compiler suites do not run at present (one does not compile, one has an outdated runner); the browser tests run in Chromium only. Both get fixed and Firefox and Safari get covered.
6. **A new compiler release.** The latest is from April 2026 and predates most of this work; repositories that depend on the compiler should take a release binary instead of a submodule.
7. **Language and library gaps** — stepped ranges, array slices, a few `System.Array` methods, `sprintf "%A"`, `async` / JSPI.
8. **Independence.** Fewer dependencies on .NET's standard libraries and third-party packages: our own base library and our own graphics and text stack.

## How we got here

The compiler began as a back end for Fable that emitted WebAssembly Text, grew a binary encoder, closures, unions, pattern matching, collections and strings on the GC heap, the host boundary with two string conventions, a base library of its own, a Component Model experiment, an optimiser, and finally the hosts: the browser runtime and the edge platforms.

## Help shape it

Good places to start: a program that does not compile (an [issue](https://github.com/fsharp-wasm/fsharp-wasm/issues) with the F# source is the best bug report — it becomes a test), a benchmark we should add, a platform we should run on, documentation.
