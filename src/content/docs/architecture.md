---
title: Architecture
description: How the compiler turns F# into WebAssembly GC — the phases, the type mapping, the two string ABIs and the hosts.
order: 2
tags:
  - architecture
  - compiler
  - internals
---

# Architecture

fsharp-wasm is a code-generation back end for a **fork of [Fable](https://fable.io)** (the fork is MIT-licensed, like Fable). The F# front end — parsing and type checking — comes from there, through a patched F# compiler; everything from the Fable AST onward is ours.

## The pipeline

```text
F# source (.fs, .fsproj)
   │  patched F# compiler + Fable front end            parsing, type checking, F# AST → Fable AST
   ▼
Fable AST
   │  Pipeline/    normalise · scope analysis · unique locals · lowering
   │  Transforms/  Fable AST → WasmGC IR; the BCL replacements; host interop
   ▼
WasmGC IR  (WType · WExpr · WFunc · WModule, in Core/AST.fs)
   │  Emit/Optimize   optimiser passes (list pipelines fused into loops, an optional inliner)
   ▼
   ├─ Emit/Wat      → .wat   the text form: read it, diff it            ─ wasm-tools parse → .wasm
   └─ Emit/Encoder  → .wasm  a built-in binary encoder (the fallback when wasm-tools is not installed)
   ▼
wasm-tools validate --features gc        and, for the exports it can describe, a WIT file
```

The WAT path and the binary encoder are two printers of the same IR, and the backend test suite checks every scenario through both. A `.wat` that `wasm-tools parse` rejects is a compiler bug.

## What an F# value becomes

| F# | WebAssembly GC |
|---|---|
| record | `struct` |
| discriminated union | a `struct` type hierarchy; pattern matching with `ref.test` / `br_on_cast` |
| `list<'T>` | linked structs |
| closure | a struct with a typed function reference; partial application and currying are compiled, not interpreted |
| `string` | `$WasmStr`: an array of UTF-16 code units on the GC heap |
| arrays | typed GC arrays; `bool[]` and `byte[]` are packed into 8 bits (a switch turns that off) |
| generics | monomorphised |
| tail calls | `return_call` |
| exceptions | the WebAssembly exception-handling proposal |
| `int64`, `float` | `i64`, `f64`: native |

There is no garbage collector in the binary: the engine's own collects the module's objects, which is why whole demo applications are 6–160 KB.

## Talking to the outside

A module sees only what it imports. What it reaches beyond itself — the DOM, a network, storage — comes through imports a **host** provides: [fsharp-wasm-runtime](https://github.com/fsharp-wasm/fsharp-wasm-runtime) in the browser, [fsharp-wasm-edge](https://github.com/fsharp-wasm/fsharp-wasm-edge) on servers. Calls into the host are declared with `[<Import("name", "module")>]`.

Strings cross the boundary in one of two ways, chosen when the module is compiled:

- **Builtins** (the default): the engine's [JS String Builtins](https://github.com/WebAssembly/js-string-builtins), imported as `wasm:js-string`; a polyfill covers an engine without them.
- **Exports** (`WASMGC_STRING_ABI=exports`): the module imports nothing from `wasm:js-string` and exports a few accessors with which the host reads and builds strings. Platforms that hand a module over precompiled — Cloudflare Workers, Vercel Edge — need this one.

## The base library

The .NET library the program expects is not the BCL: [fsharp-wasm-core](https://github.com/fsharp-wasm/fsharp-wasm-core) is a **source-only** F# base library that every program is compiled with (collections, math, exceptions, interfaces). Under .NET the same project builds with the BCL's own types. Calls into .NET methods that remain are mapped by the replacements in `Transforms/`.

## The Component Model

WIT worlds are generated from a module's exports — today for primitive types. Strings and records cannot cross a component boundary without a linear memory and the canonical ABI's adapters, which a GC module does not have. Experiments show the way: the adapters can be emitted into the GC module itself, with the UTF-16 string encoding so that nothing is transcoded, and `jco` runs the result. That work is on the [roadmap](/docs/roadmap); two modules compiled apart and linked at run time (`examples/component-linking`) work today.

## How we know it works

The compiler is checked against .NET itself: the same F# functions run on both and the results must be identical (a recorded run of 183 012 calls had no disagreement). The [tests page](/tests) lists every suite, what it checks and whether CI runs it, and the [benchmarks](/benchmarks) say what the output costs and gains against JavaScript.
