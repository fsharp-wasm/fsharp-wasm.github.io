---
publishDate: 2025-09-15T00:00:00Z
author: FSharp WasmGC Team
title: Introducing FSharp WasmGC — F# Meets WebAssembly GC
excerpt: We are building a clean-room F# compiler backend that targets WebAssembly GC directly. Here is why, how, and what is coming next.
image: ~/assets/images/blog-introducing.png
category: Announcements
tags:
  - fsharp
  - webassembly
  - wasmgc
  - compiler
---

# Introducing FSharp WasmGC

We are excited to announce **FSharp WasmGC** — a clean-room compiler backend that compiles F# directly to [WebAssembly GC](https://github.com/WebAssembly/gc).

## Why?

F# is one of the most elegant functional languages on the .NET platform. WebAssembly GC (WasmGC) is the browser's new structural memory model — bringing real garbage-collected types to Wasm instead of a flat linear memory heap.

Together, they are a perfect match.

F# discriminated unions map naturally to WasmGC sum types. F# records become WasmGC struct types. Closures become typed function references. There is no need for a JavaScript bridge, no boxing overhead, and no runtime shim.

We want F# in the browser — as first-class Wasm, not as a JavaScript transpilation target.

## How it works

FSharp WasmGC is built on top of [Fable](https://fable.io). Fable provides the battle-tested F# parser and type-checker. We replace only the code generation backend — the part that produces JavaScript in the original Fable — with our own WasmGC emitter.

The pipeline:

1. Parse and type-check your F# using Fable's pipeline
2. Translate the Fable AST to our WasmGC IR
3. Emit WebAssembly Text Format (WAT)
4. Assemble to a `.wasm` binary using `wasm-tools` (Bytecode Alliance [wasm-tools](https://github.com/bytecodealliance/wasm-tools))

The result is a compact, self-contained WasmGC module with no JavaScript dependencies.

## Current status

As of the initial announcement, **353 QuickTests pass** and **26 Showcase tests pass**. The compiler handles:

- ✅ Closures (WasmGC struct + funcref pairs)
- ✅ Discriminated unions (tagged struct types)
- ✅ F# lists (linked structs in WasmGC)
- ✅ Arrays (WasmGC array types)
- ✅ String operations (UTF-16 in WasmGC `i32` arrays)
- ✅ Multi-file `.fsproj` compilation
- ✅ Component Model / WIT export generation
- ✅ Cross-module imports via `[<Import>]`

## What's next

We are working on:

- **Generics** via a fat-pointer vtable strategy
- **BCL expansion** — Map, Set, more List/Array/String functions
- **Optimization passes** — inlining, dead-code elimination, constant folding
- **Benchmark suite** — comparing binary size, startup time, and throughput

Follow along on [GitHub](https://github.com/fsharp-wasm/fsharp-wasm) and join the [discussion](https://github.com/fsharp-wasm/fsharp-wasm/discussions). We are building this in the open and contributions are very welcome.
